<?php

namespace App\Concerns;

use App\Models\Translation;
use App\Services\TranslationService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

trait HasTranslations
{
    public static function bootHasTranslations(): void
    {
        static::deleting(function (Model $model) {
            Translation::query()
                ->where('translatable_type', $model::class)
                ->where('translatable_id', $model->getKey())
                ->delete();

            app(TranslationService::class)->flushModelCache($model);
        });
    }

    abstract public function translationGroup(): string;

    /** @return list<string> */
    abstract public function translatableKeys(): array;

    public function localized(string $key, ?string $locale = null): string
    {
        $locale ??= app()->getLocale();

        return app(TranslationService::class)->getForModel($this, $key, $locale) ?? '';
    }

    public function localizedSlug(?string $locale = null): string
    {
        return $this->localized('slug', $locale);
    }

    public function allTranslations(?string $locale = null): array
    {
        return app(TranslationService::class)->getAllForModel($this, $locale);
    }

    public function translationsByLocale(): array
    {
        return app(TranslationService::class)->getModelTranslationsByLocale($this);
    }

    public function saveTranslations(array $byLocale, ?int $userId = null): void
    {
        app(TranslationService::class)->saveModelTranslations(
            $this,
            $this->translationGroup(),
            $this->translatableKeys(),
            $byLocale,
            $userId
        );
    }

    public static function generateUniqueSlug(string $name, ?string $locale = null, ?self $exclude = null): string
    {
        $locale ??= app()->getLocale();
        $slug = Str::slug($name);
        $original = $slug;
        $counter = 1;

        while (static::slugExists($slug, $locale, $exclude)) {
            $slug = $original.'-'.$counter;
            $counter++;
        }

        return $slug;
    }

    protected static function slugExists(string $slug, string $locale, ?self $exclude = null): bool
    {
        $query = Translation::query()
            ->where('group', (new static)->translationGroup())
            ->where('key', 'slug')
            ->where('locale', $locale)
            ->where('value', $slug);

        if ($exclude) {
            $query->where(function ($q) use ($exclude) {
                $q->where('translatable_id', '!=', $exclude->getKey())
                    ->orWhere('translatable_type', '!=', static::class);
            });
        }

        return $query->exists();
    }
}
