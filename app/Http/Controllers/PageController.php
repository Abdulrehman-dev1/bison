<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Services\SeoService;
use App\Services\TranslationService;
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

    public function catalogue(?string $categorySlug = null): Response
    {
        $query = Product::query()->where('is_active', true)->orderBy('sort_order');

        if ($categorySlug) {
            $query->where('category_slug', $categorySlug);
        }

        $products = $query
            ->with(['images' => fn ($query) => $query->orderBy('sort_order')])
            ->get()
            ->map(fn (Product $p) => [
                'slug' => $p->localizedSlug(),
                'name' => $p->localizedName(),
                'description' => $p->localizedDescription(),
                'category_slug' => $p->category_slug,
                'image_path' => $p->image_path,
            ]);

        return Inertia::render('Catalogue', [
            'products' => $products,
            'categorySlug' => $categorySlug,
            'categories' => $this->localizedCategories(),
            'seo' => $this->pageSeo('catalogue'),
            'schemas' => [$this->seo->organizationSchema()],
        ]);
    }

    public function productShow(string $productSlug): Response
    {
        $product = Product::findBySlug($productSlug);

        if (! $product || ! $product->is_active) {
            abort(404);
        }

        $locale = app()->getLocale();
        $nav = $this->translations->getGroup('nav', $locale);

        $product->load(['images' => fn ($query) => $query->orderBy('sort_order')]);

        return Inertia::render('Catalogue/Show', [
            'product' => [
                'slug' => $product->localizedSlug($locale),
                'name' => $product->localizedName($locale),
                'description' => $product->localizedDescription($locale),
                'category_slug' => $product->category_slug,
                'image_path' => $product->image_path,
                'images' => $product->images->pluck('path')->values()->all(),
            ],
            'seo' => [
                'title' => $product->localizedMetaTitle($locale) ?: $product->localizedName($locale).' | Bison TradeWorks',
                'description' => $product->localizedMetaDescription($locale) ?: \Illuminate\Support\Str::limit($product->localizedDescription($locale), 160),
            ],
            'schemas' => [
                $this->seo->organizationSchema(),
                $this->seo->productSchema([
                    'name' => $product->localizedName($locale),
                    'description' => $product->localizedDescription($locale),
                    'image' => $product->image_path ? url($product->image_path) : null,
                    'url' => url('/catalogue/'.$product->localizedSlug($locale)),
                ]),
                $this->seo->breadcrumb([
                    ['name' => $nav['home'] ?? 'Home', 'url' => url('/')],
                    ['name' => $nav['catalogue'] ?? 'Catalogue', 'url' => url('/catalogue')],
                    ['name' => $product->localizedName($locale)],
                ]),
            ],
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

    private function localizedCategories(): array
    {
        $locale = app()->getLocale();

        return ProductCategory::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->mapWithKeys(fn (ProductCategory $category) => [
                $category->slug => $category->localized('title', $locale),
            ])
            ->all();
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
