<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('category_slug');
            $table->string('slug_en')->unique();
            $table->string('slug_es')->unique();
            $table->string('name_en');
            $table->string('name_es');
            $table->text('description_en');
            $table->text('description_es');
            $table->string('image_path')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('meta_title_en')->nullable();
            $table->string('meta_title_es')->nullable();
            $table->text('meta_description_en')->nullable();
            $table->text('meta_description_es')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
