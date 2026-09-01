<?php

namespace App\Models;

use App\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Translation as TranslationModel;

class Product extends Model
{
    use HasTranslations;

    protected $fillable = [
        'category_slug',
        'is_active',
        'sort_order',
    ];

    protected $appends = [
        'image_path',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'category_slug', 'slug');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function getImagePathAttribute(): ?string
    {
        if ($this->relationLoaded('images')) {
            return $this->images->first()?->path;
        }

        return $this->images()->orderBy('sort_order')->value('path');
    }

    public function translationGroup(): string
    {
        return 'product';
    }

    public function translatableKeys(): array
    {
        return ['name', 'description', 'slug', 'meta_title', 'meta_description'];
    }

    public function getRouteKeyName(): string
    {
        return 'id';
    }

    public function resolveRouteBinding($value, $field = null)
    {
        if ($field !== null) {
            return parent::resolveRouteBinding($value, $field);
        }

        $locale = app()->getLocale();

        $translation = TranslationModel::query()
            ->where('group', 'product')
            ->where('key', 'slug')
            ->where('value', $value)
            ->where('translatable_type', static::class)
            ->where(function ($query) use ($locale) {
                $query->where('locale', $locale)
                    ->orWhere('locale', Locale::defaultCode());
            })
            ->first();

        if ($translation) {
            return static::query()->findOrFail($translation->translatable_id);
        }

        return static::query()->where('id', $value)->firstOrFail();
    }

    public function localizedName(?string $locale = null): string
    {
        return $this->localized('name', $locale);
    }

    public function localizedDescription(?string $locale = null): string
    {
        return $this->localized('description', $locale);
    }

    public function localizedSlug(?string $locale = null): string
    {
        return $this->localized('slug', $locale);
    }

    public function localizedMetaTitle(?string $locale = null): string
    {
        return $this->localized('meta_title', $locale);
    }

    public function localizedMetaDescription(?string $locale = null): string
    {
        return $this->localized('meta_description', $locale);
    }

    public static function findBySlug(string $slug, ?string $locale = null): ?self
    {
        $locale ??= app()->getLocale();

        $translation = TranslationModel::query()
            ->where('group', 'product')
            ->where('key', 'slug')
            ->where('value', $slug)
            ->where('translatable_type', static::class)
            ->where(function ($query) use ($locale) {
                $query->where('locale', $locale)
                    ->orWhere('locale', Locale::defaultCode());
            })
            ->first();

        return $translation
            ? static::query()->find($translation->translatable_id)
            : null;
    }
}
