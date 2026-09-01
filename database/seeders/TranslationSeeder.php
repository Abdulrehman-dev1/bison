<?php

namespace Database\Seeders;

use App\Services\TranslationService;
use Illuminate\Database\Seeder;

class TranslationSeeder extends Seeder
{
    public function run(): void
    {
        $service = app(TranslationService::class);

        foreach (['en', 'es'] as $locale) {
            $service->importStaticFromArray('nav', $locale, require lang_path("{$locale}/nav.php"));
            $service->importStaticFromArray('common', $locale, require lang_path("{$locale}/common.php"));

            $pages = require lang_path("{$locale}/pages.php");
            foreach ($pages as $pageKey => $pageData) {
                if ($pageKey === 'contact') {
                    foreach (['general', 'request', 'partner'] as $intent) {
                        $service->importStaticFromArray(
                            "pages.contact.{$intent}",
                            $locale,
                            $pageData[$intent]
                        );
                    }

                    continue;
                }

                $service->importStaticFromArray("pages.{$pageKey}", $locale, $pageData);
            }

            $homeExtras = require database_path('seeders/data/home_extras.php');
            $service->importStaticFromArray('pages.home', $locale, $homeExtras[$locale]);

            $brandsExtras = require database_path('seeders/data/brands_extras.php');
            $service->importStaticFromArray('pages.brands', $locale, $brandsExtras[$locale]);

            $seo = require lang_path("{$locale}/seo.php");
            foreach ($seo as $pageKey => $pageData) {
                if ($pageKey === 'contact') {
                    foreach (['general', 'request', 'partner'] as $intent) {
                        $service->importStaticFromArray(
                            "seo.contact.{$intent}",
                            $locale,
                            $pageData[$intent]
                        );
                    }

                    continue;
                }

                $service->importStaticFromArray("seo.{$pageKey}", $locale, $pageData);
            }

            $services = require database_path('seeders/data/services.php');
            $service->importStaticFromArray('services', $locale, $services[$locale]);

            $steps = require database_path('seeders/data/steps.php');
            foreach (['sourcing', 'placement', 'retail'] as $stepGroup) {
                $service->importStaticFromArray(
                    "steps.{$stepGroup}",
                    $locale,
                    $steps[$locale][$stepGroup]
                );
            }

            $regions = require database_path('seeders/data/regions.php');
            $service->importStaticFromArray('regions', $locale, $regions[$locale]);
        }
    }
}
