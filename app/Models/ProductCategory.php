<?php

namespace App\Models;

use App\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Model;

class ProductCategory extends Model
{
    use HasTranslations;

    protected $fillable = [
        'slug',
        'icon',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function translationGroup(): string
    {
        return 'category';
    }

    public function translatableKeys(): array
    {
        return ['title', 'copy'];
    }
}
