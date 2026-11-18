<?php

namespace App\Services;

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

        foreach (config('catalog.lines', []) as $line) {
            $urls[] = ['loc' => $base.'/catalogue/'.$line['slug'], 'priority' => '0.7'];
        }

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
