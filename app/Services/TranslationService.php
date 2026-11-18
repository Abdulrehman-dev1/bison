<?php

namespace App\Services;

use App\Models\Locale;
use App\Models\Translation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class TranslationService
{
    public const FRONTEND_GROUPS = [
        'nav',
        'common',
        'pages',
        'seo',
        'services',
        'steps.sourcing',
        'steps.placement',
        'steps.retail',
        'regions',
        'catalog',
    ];

    public const STATIC_GROUPS = [
        'nav' => 'Navigation',
        'common' => 'Common labels',
        'pages.home' => 'Home page',
        'pages.brands' => 'Brands page',
        'pages.retailers' => 'Retailers page',
        'pages.manufacturers' => 'Manufacturers page',
        'pages.about' => 'About page',
        'pages.contact' => 'Contact page',
        'pages.contact.general' => 'Contact — General',
        'pages.contact.request' => 'Contact — Request quote',
        'pages.contact.partner' => 'Contact — Partner',
        'pages.catalogue' => 'Catalogue page',
        'seo.home' => 'SEO — Home',
        'seo.brands' => 'SEO — Brands',
        'seo.retailers' => 'SEO — Retailers',
        'seo.manufacturers' => 'SEO — Manufacturers',
        'seo.about' => 'SEO — About',
        'seo.catalogue' => 'SEO — Catalogue',
        'seo.contact' => 'SEO — Contact',
        'seo.contact.general' => 'SEO — Contact general',
        'seo.contact.request' => 'SEO — Contact request',
        'seo.contact.partner' => 'SEO — Contact partner',
        'services' => 'Services (Brands page)',
        'steps.sourcing' => 'Steps — Sourcing',
        'steps.placement' => 'Steps — Placement',
        'steps.retail' => 'Steps — Retail',
        'regions' => 'Regions (Home page)',
        'catalog' => 'Catalog',
    ];

    public function get(string $group, string $key, ?string $locale = null): ?string
    {
        $locale ??= app()->getLocale();
        $groupData = $this->getGroup($group, $locale);

        return Arr::get($groupData, $key);
    }

    public function getGroup(string $group, ?string $locale = null): array
    {
        $locale ??= app()->getLocale();

        return Cache::remember(
            $this->cacheKey($locale, $group),
            now()->addDay(),
            fn () => $this->loadStaticGroup($group, $locale)
        );
    }

    public function getFrontendBundle(?string $locale = null): array
    {
        $locale ??= app()->getLocale();

        return Cache::remember(
            "translations.frontend.{$locale}",
            now()->addDay(),
            function () use ($locale) {
                $bundle = [];

                foreach (self::FRONTEND_GROUPS as $group) {
                    if (in_array($group, ['pages', 'seo', 'steps.sourcing', 'steps.placement', 'steps.retail'], true)) {
                        continue;
                    }

                    $bundle[$group] = $this->getGroup($group, $locale);
                }

                $bundle['pages'] = $this->loadNestedPrefix('pages', $locale);
                $bundle['seo'] = $this->loadNestedPrefix('seo', $locale);
                $bundle['steps'] = [
                    'sourcing' => $this->getGroup('steps.sourcing', $locale),
                    'placement' => $this->getGroup('steps.placement', $locale),
                    'retail' => $this->getGroup('steps.retail', $locale),
                ];

                return $bundle;
            }
        );
    }

    public function getForModel(Model $model, string $key, ?string $locale = null): ?string
    {
        $locale ??= app()->getLocale();
        $group = method_exists($model, 'translationGroup') ? $model->translationGroup() : 'product';

        $values = Cache::remember(
            $this->modelCacheKey($model, $locale),
            now()->addDay(),
            fn () => $this->loadModelTranslations($model, $locale)
        );

        if (($values[$key] ?? null) !== null && $values[$key] !== '') {
            return $values[$key];
        }

        $default = Locale::defaultCode();

        if ($locale !== $default) {
            $fallback = Cache::remember(
                $this->modelCacheKey($model, $default),
                now()->addDay(),
                fn () => $this->loadModelTranslations($model, $default)
            );

            return $fallback[$key] ?? null;
        }

        return null;
    }

    public function getAllForModel(Model $model, ?string $locale = null): array
    {
        $locale ??= app()->getLocale();

        return Cache::remember(
            $this->modelCacheKey($model, $locale),
            now()->addDay(),
            fn () => $this->loadModelTranslations($model, $locale)
        );
    }

    public function getModelTranslationsByLocale(Model $model): array
    {
        $rows = Translation::query()
            ->forModel($model)
            ->get(['locale', 'key', 'value']);

        $result = [];

        foreach ($rows as $row) {
            $result[$row->locale][$row->key] = $row->value;
        }

        return $result;
    }

    public function set(
        string $group,
        string $key,
        string $locale,
        string $value,
        ?Model $model = null,
        ?int $userId = null,
    ): Translation {
        $attributes = [
            'locale' => $locale,
            'group' => $group,
            'key' => $key,
            'translatable_type' => $model ? $model::class : '',
            'translatable_id' => $model?->getKey() ?? 0,
        ];

        $translation = Translation::query()->updateOrCreate(
            $attributes,
            [
                'value' => $value,
                'updated_by' => $userId ?? Auth::id(),
            ]
        );

        $this->flushCache($locale, $group);

        if ($model) {
            $this->flushModelCache($model);
        }

        return $translation;
    }

    public function setMany(array $items): void
    {
        foreach ($items as $item) {
            $this->set(
                $item['group'],
                $item['key'],
                $item['locale'],
                $item['value'],
                $item['model'] ?? null,
                $item['updated_by'] ?? null,
            );
        }
    }

    public function saveStaticGroup(string $group, array $valuesByLocale, ?int $userId = null): void
    {
        foreach ($valuesByLocale as $locale => $flatValues) {
            foreach ($flatValues as $key => $value) {
                $this->set($group, $key, $locale, (string) $value, null, $userId);
            }
        }
    }

    public function saveModelTranslations(
        Model $model,
        string $group,
        array $keys,
        array $byLocale,
        ?int $userId = null,
    ): void {
        foreach ($byLocale as $locale => $fields) {
            foreach ($keys as $key) {
                if (! array_key_exists($key, $fields)) {
                    continue;
                }

                $this->set($group, $key, $locale, (string) $fields[$key], $model, $userId);
            }
        }

        $this->flushModelCache($model);
    }

    public function importStaticFromArray(string $group, string $locale, array $data): void
    {
        foreach (self::flattenArray($data) as $key => $value) {
            if ($value === null) {
                continue;
            }

            $this->set($group, $key, $locale, (string) $value);
        }
    }

    public function copyLocale(string $fromLocale, string $toLocale): int
    {
        $count = 0;
        $rows = Translation::query()->static()->where('locale', $fromLocale)->get();

        foreach ($rows as $row) {
            $this->set($row->group, $row->key, $toLocale, $row->value);
            $count++;
        }

        return $count;
    }

    public function getStaticGroupForAdmin(string $group): array
    {
        $locales = Locale::query()->active()->ordered()->pluck('code');
        $rows = Translation::query()
            ->static()
            ->where('group', $group)
            ->get();

        $keys = $rows->pluck('key')->unique()->sort()->values();
        $matrix = [];

        foreach ($keys as $key) {
            foreach ($locales as $locale) {
                $matrix[$key][$locale] = $rows
                    ->where('key', $key)
                    ->where('locale', $locale)
                    ->first()?->value ?? '';
            }
        }

        return $matrix;
    }

    public function searchStatic(?string $query = null, ?string $group = null, ?string $locale = null, int $perPage = 20)
    {
        $builder = Translation::query()->static()->orderBy('group')->orderBy('key');

        if ($group) {
            $builder->where('group', $group);
        }

        if ($locale) {
            $builder->where('locale', $locale);
        }

        if ($query) {
            $builder->where(function ($q) use ($query) {
                $q->where('key', 'like', "%{$query}%")
                    ->orWhere('value', 'like', "%{$query}%");
            });
        }

        return $builder->paginate($perPage)->withQueryString()->through(fn (Translation $row) => [
            'id' => $row->id,
            'group' => $row->group,
            'key' => $row->key,
            'locale' => $row->locale,
            'value' => $row->value,
        ]);
    }

    public function groupLabel(string $group): string
    {
        return self::STATIC_GROUPS[$group] ?? ucwords(str_replace(['.', '_', '-'], ' ', $group));
    }

    /** @return list<array{title: string, groups: list<string>}> */
    public static function groupSections(): array
    {
        $keys = array_keys(self::STATIC_GROUPS);

        return [
            [
                'title' => 'Site-wide',
                'description' => 'Navigation, buttons, and shared labels',
                'groups' => array_values(array_filter($keys, fn (string $key) => in_array($key, ['nav', 'common'], true))),
            ],
            [
                'title' => 'Pages',
                'description' => 'Hero copy, paragraphs, and page-specific content',
                'groups' => array_values(array_filter($keys, fn (string $key) => str_starts_with($key, 'pages.'))),
            ],
            [
                'title' => 'SEO',
                'description' => 'Meta titles and descriptions for search engines',
                'groups' => array_values(array_filter($keys, fn (string $key) => str_starts_with($key, 'seo.'))),
            ],
            [
                'title' => 'Content blocks',
                'description' => 'Services, steps, and region cards',
                'groups' => array_values(array_filter($keys, fn (string $key) => in_array($key, ['services', 'steps.sourcing', 'steps.placement', 'steps.retail', 'regions'], true))),
            ],
        ];
    }

    public function addStaticKey(string $group, string $key, array $valuesByLocale = [], ?int $userId = null): void
    {
        $defaultLocale = Locale::defaultCode();

        foreach (Locale::activeCodes() as $locale) {
            $value = $valuesByLocale[$locale] ?? ($locale === $defaultLocale ? '' : '');
            $this->set($group, $key, $locale, $value, null, $userId);
        }
    }

    public function paginateStaticGroupKeys(string $group, int $page = 1, int $perPage = 15): array
    {
        $matrix = $this->getStaticGroupForAdmin($group);
        $keys = collect(array_keys($matrix))->sort()->values();
        $total = $keys->count();
        $pageKeys = $keys->forPage($page, $perPage)->values();

        $pageMatrix = [];
        foreach ($pageKeys as $key) {
            $pageMatrix[$key] = $matrix[$key];
        }

        return [
            'matrix' => $pageMatrix,
            'keysPaginator' => new LengthAwarePaginator(
                $pageKeys->all(),
                $total,
                $perPage,
                $page,
                ['path' => request()->url(), 'pageName' => 'keys_page']
            ),
        ];
    }

    public function missingKeysForLocale(string $locale): array
    {
        $default = Locale::defaultCode();
        $defaultKeys = Translation::query()->static()->where('locale', $default)->get();
        $missing = [];

        foreach ($defaultKeys as $row) {
            $exists = Translation::query()->static()
                ->where('locale', $locale)
                ->where('group', $row->group)
                ->where('key', $row->key)
                ->where('value', '!=', '')
                ->exists();

            if (! $exists) {
                $missing[] = [
                    'group' => $row->group,
                    'key' => $row->key,
                ];
            }
        }

        return $missing;
    }

    public function flushCache(?string $locale = null, ?string $group = null): void
    {
        if ($locale && $group) {
            Cache::forget($this->cacheKey($locale, $group));
            Cache::forget("translations.frontend.{$locale}");

            return;
        }

        foreach (Locale::activeCodes() as $code) {
            Cache::forget("translations.frontend.{$code}");

            foreach (array_keys(self::STATIC_GROUPS) as $staticGroup) {
                Cache::forget($this->cacheKey($code, $staticGroup));
            }
        }
    }

    public function flushModelCache(Model $model): void
    {
        foreach (Locale::activeCodes() as $code) {
            Cache::forget($this->modelCacheKey($model, $code));
        }
    }

    public static function flattenArray(array $data, string $prefix = ''): array
    {
        $result = [];

        foreach ($data as $key => $value) {
            $fullKey = $prefix === '' ? (string) $key : "{$prefix}.{$key}";

            if (is_array($value)) {
                if (self::isListArray($value)) {
                    foreach ($value as $index => $item) {
                        if (is_array($item)) {
                            $result = array_merge($result, self::flattenArray($item, "{$fullKey}.{$index}"));
                        } else {
                            $result["{$fullKey}.{$index}"] = $item;
                        }
                    }
                } else {
                    $result = array_merge($result, self::flattenArray($value, $fullKey));
                }
            } else {
                $result[$fullKey] = $value;
            }
        }

        return $result;
    }

    public static function unflattenArray(array $flat): array
    {
        $result = [];

        foreach ($flat as $key => $value) {
            Arr::set($result, $key, $value);
        }

        return $result;
    }

    private function loadStaticGroup(string $group, string $locale): array
    {
        $rows = Translation::query()
            ->static()
            ->where('group', $group)
            ->where('locale', $locale)
            ->pluck('value', 'key')
            ->all();

        if ($rows === [] && $locale !== Locale::defaultCode()) {
            $rows = Translation::query()
                ->static()
                ->where('group', $group)
                ->where('locale', Locale::defaultCode())
                ->pluck('value', 'key')
                ->all();
        }

        return self::unflattenArray($rows);
    }

    private function loadNestedPrefix(string $prefix, string $locale): array
    {
        $groups = Translation::query()
            ->static()
            ->where('group', 'like', "{$prefix}.%")
            ->where('locale', $locale)
            ->distinct()
            ->pluck('group');

        if ($groups->isEmpty() && $locale !== Locale::defaultCode()) {
            $groups = Translation::query()
                ->static()
                ->where('group', 'like', "{$prefix}.%")
                ->where('locale', Locale::defaultCode())
                ->distinct()
                ->pluck('group');
        }

        $nested = [];

        foreach ($groups as $fullGroup) {
            $subKey = substr($fullGroup, strlen($prefix) + 1);
            Arr::set($nested, $subKey, $this->loadStaticGroup($fullGroup, $locale));
        }

        return $nested;
    }

    private function loadModelTranslations(Model $model, string $locale): array
    {
        $group = method_exists($model, 'translationGroup') ? $model->translationGroup() : 'product';

        $rows = Translation::query()
            ->forModel($model)
            ->where('group', $group)
            ->where('locale', $locale)
            ->pluck('value', 'key')
            ->all();

        if ($rows === [] && $locale !== Locale::defaultCode()) {
            $rows = Translation::query()
                ->forModel($model)
                ->where('group', $group)
                ->where('locale', Locale::defaultCode())
                ->pluck('value', 'key')
                ->all();
        }

        return $rows;
    }

    private function cacheKey(string $locale, string $group): string
    {
        return "translations.{$locale}.{$group}";
    }

    private function modelCacheKey(Model $model, string $locale): string
    {
        return 'translations.model.'.get_class($model).'.'.$model->getKey().'.'.$locale;
    }

    private static function isListArray(array $array): bool
    {
        if ($array === []) {
            return true;
        }

        return array_keys($array) === range(0, count($array) - 1);
    }
}
