<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use Illuminate\Database\Seeder;

class ProductCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['slug' => 'equestrian', 'icon' => 'Compass', 'sort_order' => 1],
            ['slug' => 'dog-gear', 'icon' => 'PawPrint', 'sort_order' => 2],
            ['slug' => 'boots-belts', 'icon' => 'Footprints', 'sort_order' => 3],
            ['slug' => 'jackets', 'icon' => 'Shirt', 'sort_order' => 4],
            ['slug' => 'bags', 'icon' => 'ShoppingBag', 'sort_order' => 5],
            ['slug' => 'hides', 'icon' => 'Layers', 'sort_order' => 6],
        ];

        $titles = [
            'en' => [
                'equestrian' => ['title' => 'Equestrian & Tack', 'copy' => 'Saddles, tack, and equestrian accessories.'],
                'dog-gear' => ['title' => 'Dog Gear', 'copy' => 'Leashes, leads, and harnesses.'],
                'boots-belts' => ['title' => 'Boots & Belts', 'copy' => 'Leather boots and belts, for work, western, and everyday wear.'],
                'jackets' => ['title' => 'Jackets', 'copy' => 'Leather jackets, classic and modern cuts.'],
                'bags' => ['title' => 'Bags & Small Leather Goods', 'copy' => 'Handbags, backpacks, briefcases, wallets, and other leather goods, with personalization and monogramming available.'],
                'hides' => ['title' => 'Hides & More', 'copy' => 'Cowhide rugs and tanned hide skins, with white-label available.'],
            ],
            'es' => [
                'equestrian' => ['title' => 'Equitación y Arneses', 'copy' => 'Sillas de montar, arneses y accesorios ecuestres.'],
                'dog-gear' => ['title' => 'Artículos para Perros', 'copy' => 'Correas, traíllas y arneses.'],
                'boots-belts' => ['title' => 'Botas y Cinturones', 'copy' => 'Botas y cinturones de cuero para trabajo, western y uso diario.'],
                'jackets' => ['title' => 'Chamarras', 'copy' => 'Chamarras de cuero, cortes clásicos y modernos.'],
                'bags' => ['title' => 'Bolsas y Artículos de Cuero', 'copy' => 'Bolsas, mochilas, maletines, carteras y otros artículos de cuero, con personalización y monograma disponibles.'],
                'hides' => ['title' => 'Pieles y Más', 'copy' => 'Alfombras de piel de vaca y pieles curtidas, con marca blanca disponible.'],
            ],
        ];

        foreach ($categories as $category) {
            $model = ProductCategory::query()->updateOrCreate(
                ['slug' => $category['slug']],
                [
                    'icon' => $category['icon'],
                    'sort_order' => $category['sort_order'],
                    'is_active' => true,
                ]
            );

            foreach (['en', 'es'] as $locale) {
                $model->saveTranslations([
                    $locale => $titles[$locale][$category['slug']],
                ]);
            }
        }
    }
}
