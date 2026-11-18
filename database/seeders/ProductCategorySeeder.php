<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use Illuminate\Database\Seeder;

class ProductCategorySeeder extends Seeder
{
    public function run(): void
    {
        foreach (config('catalog.retired', []) as $slug) {
            ProductCategory::query()->where('slug', $slug)->update(['is_active' => false]);
        }

        foreach (config('catalog.lines') as $line) {
            $model = ProductCategory::query()->updateOrCreate(
                ['slug' => $line['slug']],
                [
                    'icon' => $line['icon'],
                    'sort_order' => $line['retail_order'],
                    'is_active' => true,
                ]
            );

            $model->saveTranslations([
                'en' => [
                    'title' => $line['title']['en'],
                    'copy' => $line['copy']['en'],
                ],
                'es' => [
                    'title' => $line['title']['es'],
                    'copy' => $line['copy']['es'],
                ],
            ]);
        }
    }
}
