<?php

namespace App\Services;

class SeoService
{
    public function organizationSchema(): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            'name' => 'Bison TradeWorks',
            'url' => config('app.url'),
            'logo' => config('app.url').'/images/static/bison-logo.png',
            'email' => 'contact@bisontradeworks.com',
            'telephone' => '+1-978-760-2805',
            'areaServed' => ['US', 'CA', 'MX'],
            'address' => [
                ['@type' => 'PostalAddress', 'addressRegion' => 'TX', 'addressCountry' => 'US'],
                ['@type' => 'PostalAddress', 'addressLocality' => 'León', 'addressRegion' => 'Guanajuato', 'addressCountry' => 'MX'],
            ],
        ];
    }

    public function websiteSchema(): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            'name' => 'Bison TradeWorks',
            'url' => config('app.url'),
        ];
    }

    public function breadcrumb(array $items): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => collect($items)->values()->map(fn ($item, $index) => [
                '@type' => 'ListItem',
                'position' => $index + 1,
                'name' => $item['name'],
                'item' => $item['url'] ?? null,
            ])->all(),
        ];
    }

    public function productSchema(array $product): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'Product',
            'name' => $product['name'],
            'description' => $product['description'],
            'image' => $product['image'] ?? null,
            'url' => $product['url'],
        ];
    }

    public function faqSchema(array $faqs): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => collect($faqs)->map(fn ($faq) => [
                '@type' => 'Question',
                'name' => $faq['question'],
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => $faq['answer'],
                ],
            ])->all(),
        ];
    }
}
