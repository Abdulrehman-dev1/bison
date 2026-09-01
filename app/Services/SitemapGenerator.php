<?php

namespace App\Services;

use App\Models\Locale;
use App\Models\Product;
use Illuminate\Support\Facades\File;

class SitemapGenerator
{
    public function generate(): string
    {
        $base = rtrim(config('app.url'), '/');
        $urls = [
            ['loc' => $base.'/', 'priority' => '1.0'],
            ['loc' => $base.'/brands', 'priority' => '0.9'],
            ['loc' => $base.'/retailers', 'priority' => '0.9'],
            ['loc' => $base.'/catalogue', 'priority' => '0.9'],
            ['loc' => $base.'/manufacturers', 'priority' => '0.9'],
            ['loc' => $base.'/about', 'priority' => '0.8'],
            ['loc' => $base.'/contact', 'priority' => '0.8'],
            ['loc' => $base.'/contact/request-a-quote', 'priority' => '0.7'],
            ['loc' => $base.'/contact/become-a-partner', 'priority' => '0.7'],
        ];

        $locales = Locale::activeCodes() ?: ['en', 'es'];

        Product::query()->where('is_active', true)->get()->each(function (Product $product) use (&$urls, $base, $locales) {
            foreach ($locales as $locale) {
                $slug = $product->localizedSlug($locale);

                if ($slug !== '') {
                    $urls[] = ['loc' => $base.'/catalogue/'.$slug, 'priority' => '0.7'];
                }
            }
        });

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        foreach ($urls as $url) {
            $xml .= '<url>';
            $xml .= '<loc>'.htmlspecialchars($url['loc']).'</loc>';
            $xml .= '<priority>'.$url['priority'].'</priority>';
            $xml .= '</url>';
        }

        $xml .= '</urlset>';

        File::put(public_path('sitemap.xml'), $xml);

        return $xml;
    }
}
