<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use App\Services\SeoService;
use App\Services\TranslationService;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function __construct(
        private SeoService $seo,
        private TranslationService $translations,
    ) {}

    public function home(): Response
    {
        return Inertia::render('Home', [
            'seo' => $this->pageSeo('home'),
            'schemas' => [$this->seo->organizationSchema(), $this->seo->websiteSchema()],
        ]);
    }

    public function brands(): Response
    {
        $pages = $this->pages();
        $faqs = $pages['brands']['faqs'] ?? [];

        return Inertia::render('Brands', [
            'seo' => $this->pageSeo('brands'),
            'schemas' => [
                $this->seo->organizationSchema(),
                $this->seo->faqSchema($faqs),
            ],
            'faqs' => $faqs,
        ]);
    }

    public function retailers(): Response
    {
        return Inertia::render('Retailers', [
            'seo' => $this->pageSeo('retailers'),
            'schemas' => [$this->seo->organizationSchema()],
            'categories' => $this->localizedCategoryCards(),
        ]);
    }

    public function manufacturers(): Response
    {
        $pages = $this->pages();
        $faqs = $pages['manufacturers']['faqs'] ?? [];

        return Inertia::render('Manufacturers', [
            'seo' => $this->pageSeo('manufacturers'),
            'schemas' => [
                $this->seo->organizationSchema(),
                $this->seo->faqSchema($faqs),
            ],
            'faqs' => $faqs,
        ]);
    }

    public function about(): Response
    {
        return Inertia::render('About', [
            'seo' => $this->pageSeo('about'),
            'schemas' => [$this->seo->organizationSchema()],
        ]);
    }

    public function contact(string $intent = 'general'): Response
    {
        if (! in_array($intent, ['general', 'request', 'partner'], true)) {
            abort(404);
        }

        $pages = $this->pages();
        $h1 = $pages['contact'][$intent]['h1'] ?? '';

        return Inertia::render('Contact', [
            'intent' => $intent,
            'seo' => $this->pageSeo("contact.{$intent}"),
            'schemas' => [
                $this->seo->organizationSchema(),
                ['@context' => 'https://schema.org', '@type' => 'ContactPage', 'name' => $h1],
            ],
        ]);
    }

    public function catalogue(?string $line = null): Response
    {
        $payload = $this->catalogPayload($line);
        $title = $payload['active']['title'] ?? null;

        return Inertia::render('Catalogue', [
            ...$payload,
            'seo' => $title
                ? [
                    'title' => $title.' | Bison TradeWorks',
                    'description' => $this->pageSeo('catalogue')['description'],
                ]
                : $this->pageSeo('catalogue'),
            'schemas' => [$this->seo->organizationSchema()],
        ]);
    }

    private function pageSeo(string $key): array
    {
        $seo = $this->translations->getFrontendBundle(app()->getLocale())['seo'] ?? [];

        return [
            'title' => data_get($seo, "{$key}.title", ''),
            'description' => data_get($seo, "{$key}.description", ''),
        ];
    }

    private function pages(): array
    {
        return $this->translations->getFrontendBundle(app()->getLocale())['pages'] ?? [];
    }

    /**
     * @return array{line: ?string, lines: array<int, array<string, mixed>>, products: array<int, mixed>, active: ?array<string, mixed>}
     */
    private function catalogPayload(?string $line): array
    {
        $locale = app()->getLocale();
        $products = $this->catalogProducts();
        $defined = collect(config('catalog.lines', []));

        if ($line !== null && ! $defined->contains(fn (array $row) => $row['slug'] === $line)) {
            abort(404);
        }

        $categories = ProductCategory::query()
            ->whereIn('slug', $defined->pluck('slug'))
            ->get()
            ->keyBy('slug');

        $lines = $defined
            ->sortBy('catalog_order')
            ->values()
            ->map(function (array $row) use ($products, $categories, $locale) {
                $category = $categories->get($row['slug']);
                $title = $category?->localized('title', $locale) ?: ($row['title'][$locale] ?? $row['title']['en']);

                return [
                    'slug' => $row['slug'],
                    'title' => $title,
                    'image' => $row['image'],
                    'count' => collect($products)->where('l', $row['slug'])->count(),
                ];
            })
            ->all();

        $active = $line === null
            ? null
            : collect($lines)->firstWhere('slug', $line);

        $visible = $line === null
            ? []
            : $this->withColorPhotos(array_values(array_filter(
                $products,
                fn (array $product) => ($product['l'] ?? null) === $line,
            )));

        return [
            'line' => $line,
            'lines' => $lines,
            'products' => $visible,
            'active' => $active,
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function catalogProducts(): array
    {
        $path = public_path('catalog/catalog.json');

        if (! is_file($path)) {
            return [];
        }

        $decoded = json_decode(File::get($path), true);

        return is_array($decoded) ? $decoded : [];
    }

    /**
     * Attach each color's own photos when files are named with that color's SKU.
     *
     * WB-001-BLK.jpg and WB-001-BLK-1.jpg belong to SKU WB-001-BLK.
     * The style photo stays the fallback when a color has no files of its own.
     *
     * @param  array<int, array<string, mixed>>  $products
     * @return array<int, array<string, mixed>>
     */
    private function withColorPhotos(array $products): array
    {
        $index = $this->catalogFileIndex();

        foreach ($products as &$product) {
            $photos = [];

            foreach ($this->colorSkus($product) as $sku) {
                $matches = $index[$sku] ?? [];

                if ($matches !== []) {
                    $photos[$sku] = $matches;
                }
            }

            if ($photos !== []) {
                $product['photos'] = $photos;
            }
        }
        unset($product);

        return $products;
    }

    /**
     * @param  array<string, mixed>  $product
     * @return array<int, string>
     */
    private function colorSkus(array $product): array
    {
        $skus = [];

        foreach ($product['k'] ?? [] as $color) {
            if (! empty($color[2])) {
                $skus[] = (string) $color[2];
            }
        }

        if ($skus === []) {
            foreach ($product['s'] ?? [] as $option) {
                $sku = (string) ($option[0] ?? '');

                if ($sku !== '' && $sku !== ($product['c'] ?? null)) {
                    $skus[] = $sku;
                }
            }
        }

        return $skus;
    }

    /**
     * @return array<string, array<int, string>>
     */
    private function catalogFileIndex(): array
    {
        $directory = public_path('catalog');

        if (! is_dir($directory)) {
            return [];
        }

        $index = [];

        foreach (File::files($directory) as $file) {
            $name = $file->getFilename();

            if (! preg_match('/\.(jpe?g|png|webp)$/i', $name)) {
                continue;
            }

            $stem = pathinfo($name, PATHINFO_FILENAME);
            $path = '/catalog/'.$name;
            $index[$stem][] = $path;

            if (preg_match('/^(.+)-\d+$/', $stem, $matches) === 1) {
                $index[$matches[1]][] = $path;
            }
        }

        foreach ($index as &$paths) {
            $paths = array_values(array_unique($paths));
            usort($paths, function (string $left, string $right): int {
                return $this->photoRank($left) <=> $this->photoRank($right);
            });
        }

        return $index;
    }

    private function photoRank(string $path): string
    {
        $stem = pathinfo($path, PATHINFO_FILENAME);

        if (preg_match('/-(\d+)$/', $stem, $matches) === 1) {
            return sprintf('1-%05d-%s', (int) $matches[1], $stem);
        }

        return '0-00000-'.$stem;
    }

    private function localizedCategoryCards(): array
    {
        $locale = app()->getLocale();

        return ProductCategory::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (ProductCategory $category) => [
                'slug' => $category->slug,
                'icon' => $category->icon,
                'title' => $category->localized('title', $locale),
                'copy' => $category->localized('copy', $locale),
            ])
            ->all();
    }
}
