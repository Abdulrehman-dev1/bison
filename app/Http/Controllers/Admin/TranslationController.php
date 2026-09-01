<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTranslationKeyRequest;
use App\Http\Requests\UpdateStaticTranslationsRequest;
use App\Models\Locale;
use App\Models\ProductCategory;
use App\Models\Translation;
use App\Services\AuditService;
use App\Services\TranslationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TranslationController extends Controller
{
    public function index(Request $request, TranslationService $translations): Response
    {
        $searchActive = $request->filled('q') || $request->filled('group') || $request->filled('locale');

        $groupMeta = collect(TranslationService::STATIC_GROUPS)
            ->mapWithKeys(fn (string $label, string $key) => [
                $key => [
                    'key' => $key,
                    'label' => $label,
                    'keys_count' => Translation::query()->static()->where('group', $key)->distinct()->count('key'),
                ],
            ]);

        return Inertia::render('Admin/Translations/Index', [
            'sections' => TranslationService::groupSections(),
            'groupMeta' => $groupMeta->all(),
            'categoryCard' => [
                'key' => 'categories',
                'label' => 'Product categories',
                'keys_count' => ProductCategory::query()->count(),
                'href' => route('admin.translations.categories'),
            ],
            'locales' => Locale::query()->active()->ordered()->get(['code', 'native_name']),
            'results' => $searchActive
                ? $translations->searchStatic(
                    $request->query('q'),
                    $request->query('group'),
                    $request->query('locale'),
                )
                : null,
            'filters' => [
                'q' => $request->query('q', ''),
                'group' => $request->query('group', ''),
                'locale' => $request->query('locale', ''),
            ],
            'missingCounts' => Locale::query()->active()->ordered()->get()->mapWithKeys(
                fn (Locale $locale) => [$locale->code => count($translations->missingKeysForLocale($locale->code))]
            ),
            'totalKeys' => Translation::query()->static()->distinct()->count('key'),
        ]);
    }

    public function edit(Request $request, string $group, TranslationService $translations): Response
    {
        if (! $this->groupExists($group)) {
            abort(404);
        }

        $page = $request->integer('keys_page', 1);
        $paginated = $translations->paginateStaticGroupKeys($group, $page);

        return Inertia::render('Admin/Translations/Edit', [
            'group' => $group,
            'groupLabel' => $translations->groupLabel($group),
            'locales' => Locale::query()->active()->ordered()->get(['code', 'name', 'native_name']),
            'matrix' => $paginated['matrix'],
            'keysPaginator' => $paginated['keysPaginator'],
            'usageHint' => "Use in code: t('{$group}.your_key')",
        ]);
    }

    public function update(UpdateStaticTranslationsRequest $request, string $group, TranslationService $translations): RedirectResponse
    {
        if (! $this->groupExists($group)) {
            abort(404);
        }

        $translations->saveStaticGroup($group, $request->validated('values'), $request->user()?->id);

        AuditService::log('translation.updated', "Updated static translations for \"{$group}\".");

        return redirect()
            ->route('admin.translations.edit', ['group' => $group, 'keys_page' => $request->query('keys_page')])
            ->with('success', 'Translations saved successfully.');
    }

    public function storeKey(StoreTranslationKeyRequest $request, string $group, TranslationService $translations): RedirectResponse
    {
        if (! $this->groupExists($group)) {
            abort(404);
        }

        $data = $request->validated();
        $values = [];

        foreach (Locale::activeCodes() as $locale) {
            $values[$locale] = $data['values'][$locale] ?? ($locale === Locale::defaultCode() ? ($data['default_value'] ?? '') : '');
        }

        $translations->addStaticKey($group, $data['key'], $values, $request->user()?->id);

        AuditService::log('translation.key_created', "Added translation key \"{$data['key']}\" to \"{$group}\".");

        return redirect()
            ->route('admin.translations.edit', $group)
            ->with('success', 'Translation key added. Fill in all languages and save.');
    }

    public function categories(Request $request): Response
    {
        $locales = Locale::query()->active()->ordered()->get(['code', 'native_name']);

        $categories = ProductCategory::query()
            ->orderBy('sort_order')
            ->paginate(6)
            ->withQueryString()
            ->through(function (ProductCategory $category) use ($locales) {
                $byLocale = $category->translationsByLocale();
                $values = [];

                foreach ($locales as $locale) {
                    $values[$locale->code] = [
                        'title' => $byLocale[$locale->code]['title'] ?? '',
                        'copy' => $byLocale[$locale->code]['copy'] ?? '',
                    ];
                }

                return [
                    'id' => $category->id,
                    'slug' => $category->slug,
                    'icon' => $category->icon,
                    'values' => $values,
                ];
            });

        return Inertia::render('Admin/Translations/Categories', [
            'locales' => $locales,
            'categories' => $categories,
        ]);
    }

    public function updateCategory(Request $request, ProductCategory $category): RedirectResponse
    {
        $validated = $request->validate([
            'values' => ['required', 'array'],
            'values.*.title' => ['required', 'string', 'max:255'],
            'values.*.copy' => ['required', 'string'],
        ]);

        $category->saveTranslations($validated['values'], $request->user()?->id);

        AuditService::log('translation.updated', "Updated category translations for \"{$category->slug}\".", $category);

        return back()->with('success', 'Category translations saved.');
    }

    private function groupExists(string $group): bool
    {
        return array_key_exists($group, TranslationService::STATIC_GROUPS)
            || Translation::query()->static()->where('group', $group)->exists();
    }
}
