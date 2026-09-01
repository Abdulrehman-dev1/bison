<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Models\Locale;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\ProductImage;
use App\Services\AuditService;
use App\Services\PublicImageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(private PublicImageService $images) {}

    public function index(Request $request): Response
    {
        $defaultLocale = Locale::defaultCode();

        $products = Product::query()
            ->with(['images' => fn ($query) => $query->orderBy('sort_order')->limit(1)])
            ->orderBy('sort_order')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Product $product) => [
                'id' => $product->id,
                'category_slug' => $product->category_slug,
                'name' => $product->localizedName($defaultLocale),
                'is_active' => $product->is_active,
                'sort_order' => $product->sort_order,
                'image_path' => $product->image_path,
            ]);

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Products/Form', [
            'product' => null,
            'categories' => $this->categories(),
            'locales' => Locale::query()->active()->ordered()->get(['code', 'native_name']),
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $translations = $this->prepareTranslations($data['translations']);

        $product = Product::query()->create([
            'category_slug' => $data['category_slug'],
            'is_active' => $data['is_active'] ?? true,
            'sort_order' => $data['sort_order'] ?? 0,
        ]);

        $product->saveTranslations($translations, $request->user()?->id);
        $this->syncImages($product, $request);

        AuditService::log(
            'product.created',
            'Created product "'.$product->localizedName().'".',
            $product,
            null,
            $request
        );

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    public function edit(Product $product): Response
    {
        $product->load(['images' => fn ($query) => $query->orderBy('sort_order')]);

        return Inertia::render('Admin/Products/Form', [
            'product' => [
                'id' => $product->id,
                'category_slug' => $product->category_slug,
                'is_active' => $product->is_active,
                'sort_order' => $product->sort_order,
                'images' => $product->images->map(fn (ProductImage $image) => [
                    'id' => $image->id,
                    'path' => $image->path,
                    'sort_order' => $image->sort_order,
                ])->values(),
                'translations' => $product->translationsByLocale(),
            ],
            'categories' => $this->categories(),
            'locales' => Locale::query()->active()->ordered()->get(['code', 'native_name']),
        ]);
    }

    public function update(StoreProductRequest $request, Product $product): RedirectResponse
    {
        $data = $request->validated();
        $translations = $this->prepareTranslations($data['translations'], $product);

        $product->update([
            'category_slug' => $data['category_slug'],
            'is_active' => $data['is_active'] ?? true,
            'sort_order' => $data['sort_order'] ?? 0,
        ]);

        $product->saveTranslations($translations, $request->user()?->id);
        $this->syncImages($product, $request);

        AuditService::log(
            'product.updated',
            'Updated product "'.$product->localizedName().'".',
            $product,
            null,
            $request
        );

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $name = $product->localizedName();

        $product->load('images');
        foreach ($product->images as $image) {
            $this->images->delete($image->path);
        }

        $product->delete();

        AuditService::log('product.deleted', "Deleted product \"{$name}\".");

        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }

    private function syncImages(Product $product, Request $request): void
    {
        $removedIds = collect($request->input('removed_image_ids', []))
            ->map(fn ($id) => (int) $id)
            ->filter()
            ->unique()
            ->values();

        if ($removedIds->isNotEmpty()) {
            ProductImage::query()
                ->where('product_id', $product->id)
                ->whereIn('id', $removedIds)
                ->get()
                ->each(function (ProductImage $image) {
                    $this->images->delete($image->path);
                    $image->delete();
                });
        }

        $existingOrder = collect($request->input('existing_image_ids', []))
            ->map(fn ($id) => (int) $id)
            ->filter()
            ->values();

        foreach ($existingOrder as $sortOrder => $imageId) {
            ProductImage::query()
                ->where('product_id', $product->id)
                ->where('id', $imageId)
                ->update(['sort_order' => $sortOrder]);
        }

        $nextSortOrder = $existingOrder->count();

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                try {
                    $path = $this->images->uploadOptimized($file, 'products');
                } catch (\InvalidArgumentException $exception) {
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'images' => $exception->getMessage(),
                    ]);
                } catch (\Throwable $exception) {
                    report($exception);

                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'images' => 'One or more images could not be processed. Try JPG, PNG, or WebP under 5 MB.',
                    ]);
                }

                ProductImage::query()->create([
                    'product_id' => $product->id,
                    'path' => $path,
                    'sort_order' => $nextSortOrder,
                ]);

                $nextSortOrder++;
                gc_collect_cycles();
            }
        }
    }

    private function prepareTranslations(array $translations, ?Product $product = null): array
    {
        foreach ($translations as $locale => &$fields) {
            if (empty($fields['slug']) && ! empty($fields['name'])) {
                $fields['slug'] = Product::generateUniqueSlug($fields['name'], $locale, $product);
            }
        }

        return $translations;
    }

    private function categories(): array
    {
        $defaultLocale = Locale::defaultCode();

        return ProductCategory::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->mapWithKeys(fn (ProductCategory $category) => [
                $category->slug => $category->localized('title', $defaultLocale),
            ])
            ->all();
    }
}
