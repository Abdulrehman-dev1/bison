<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'category_slug' => 'equestrian',
                'en' => [
                    'name' => 'Equestrian & Tack',
                    'description' => 'Saddles, tack, and equestrian accessories.',
                ],
                'es' => [
                    'name' => 'Equitación y Arneses',
                    'description' => 'Sillas de montar, arneses y accesorios ecuestres.',
                ],
            ],
            [
                'category_slug' => 'dog-gear',
                'en' => [
                    'name' => 'Dog Gear',
                    'description' => 'Leashes, leads, and harnesses.',
                ],
                'es' => [
                    'name' => 'Artículos para Perros',
                    'description' => 'Correas, traíllas y arneses.',
                ],
            ],
            [
                'category_slug' => 'boots-belts',
                'en' => [
                    'name' => 'Boots & Belts',
                    'description' => 'Leather boots and belts, for work, western, and everyday wear.',
                ],
                'es' => [
                    'name' => 'Botas y Cinturones',
                    'description' => 'Botas y cinturones de cuero para trabajo, western y uso diario.',
                ],
            ],
            [
                'category_slug' => 'jackets',
                'en' => [
                    'name' => 'Jackets',
                    'description' => 'Leather jackets, classic and modern cuts.',
                ],
                'es' => [
                    'name' => 'Chamarras',
                    'description' => 'Chamarras de cuero, cortes clásicos y modernos.',
                ],
            ],
            [
                'category_slug' => 'bags',
                'en' => [
                    'name' => 'Bags & Small Leather Goods',
                    'description' => 'Handbags, backpacks, briefcases, wallets, and other leather goods, with personalization and monogramming available.',
                ],
                'es' => [
                    'name' => 'Bolsas y Artículos de Cuero',
                    'description' => 'Bolsas, mochilas, maletines, carteras y otros artículos de cuero, con personalización y monograma disponibles.',
                ],
            ],
            [
                'category_slug' => 'hides',
                'en' => [
                    'name' => 'Hides & More',
                    'description' => 'Cowhide rugs and tanned hide skins, with white-label available.',
                ],
                'es' => [
                    'name' => 'Pieles y Más',
                    'description' => 'Alfombras de piel de vaca y pieles curtidas, con marca blanca disponible.',
                ],
            ],
        ];

        foreach ($products as $index => $productData) {
            $product = Product::query()->firstOrCreate(
                ['category_slug' => $productData['category_slug']],
                [
                    'is_active' => true,
                    'sort_order' => $index + 1,
                ]
            );

            $translations = [];

            foreach (['en', 'es'] as $locale) {
                $name = $productData[$locale]['name'];
                $translations[$locale] = [
                    'name' => $name,
                    'description' => $productData[$locale]['description'],
                    'slug' => Str::slug($name),
                ];
            }

            $product->saveTranslations($translations);
        }
    }
}
