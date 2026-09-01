<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('path');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        if (Schema::hasColumn('products', 'image_path')) {
            $products = DB::table('products')->whereNotNull('image_path')->get(['id', 'image_path']);

            foreach ($products as $product) {
                DB::table('product_images')->insert([
                    'product_id' => $product->id,
                    'path' => $product->image_path,
                    'sort_order' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('image_path');
            });
        }
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('image_path')->nullable();
        });

        $firstImages = DB::table('product_images')
            ->select('product_id', 'path')
            ->orderBy('sort_order')
            ->get()
            ->unique('product_id');

        foreach ($firstImages as $row) {
            DB::table('products')->where('id', $row->product_id)->update(['image_path' => $row->path]);
        }

        Schema::dropIfExists('product_images');
    }
};
