<?php

use App\Models\Locale;
use App\Models\Product;
use App\Models\Translation;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const PRODUCT_KEYS = [
        'name',
        'description',
        'slug',
        'meta_title',
        'meta_description',
    ];

    public function up(): void
    {
        if (! Schema::hasColumn('products', 'name_en')) {
            return;
        }

        $this->ensureLocalesExist();

        Product::query()->each(function (Product $product) {
            foreach (['en', 'es'] as $locale) {
                foreach (self::PRODUCT_KEYS as $key) {
                    $column = "{$key}_{$locale}";
                    $value = $product->getAttribute($column);

                    if ($value === null || $value === '') {
                        continue;
                    }

                    Translation::query()->updateOrCreate(
                        [
                            'locale' => $locale,
                            'group' => 'product',
                            'key' => $key,
                            'translatable_type' => Product::class,
                            'translatable_id' => $product->id,
                        ],
                        ['value' => $value]
                    );
                }
            }
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropUnique(['slug_en']);
            $table->dropUnique(['slug_es']);
            $table->dropColumn([
                'slug_en',
                'slug_es',
                'name_en',
                'name_es',
                'description_en',
                'description_es',
                'meta_title_en',
                'meta_title_es',
                'meta_description_en',
                'meta_description_es',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('slug_en')->nullable();
            $table->string('slug_es')->nullable();
            $table->string('name_en')->nullable();
            $table->string('name_es')->nullable();
            $table->text('description_en')->nullable();
            $table->text('description_es')->nullable();
            $table->string('meta_title_en')->nullable();
            $table->string('meta_title_es')->nullable();
            $table->text('meta_description_en')->nullable();
            $table->text('meta_description_es')->nullable();
        });

        Translation::query()
            ->where('group', 'product')
            ->where('translatable_type', Product::class)
            ->each(function (Translation $translation) {
                $product = Product::query()->find($translation->translatable_id);

                if (! $product) {
                    return;
                }

                $column = "{$translation->key}_{$translation->locale}";
                if (Schema::hasColumn('products', $column)) {
                    $product->update([$column => $translation->value]);
                }
            });
    }

    private function ensureLocalesExist(): void
    {
        Locale::query()->updateOrCreate(
            ['code' => 'en'],
            ['name' => 'English', 'native_name' => 'English', 'is_active' => true, 'is_default' => true, 'sort_order' => 1]
        );

        Locale::query()->updateOrCreate(
            ['code' => 'es'],
            ['name' => 'Spanish', 'native_name' => 'Español', 'is_active' => true, 'is_default' => false, 'sort_order' => 2]
        );
    }
};
