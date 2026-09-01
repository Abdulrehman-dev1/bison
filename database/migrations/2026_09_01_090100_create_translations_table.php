<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('translations', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 10);
            $table->string('group', 120);
            $table->string('key', 191);
            $table->text('value');
            $table->string('translatable_type', 120)->default('');
            $table->unsignedBigInteger('translatable_id')->default(0);
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->foreign('locale')->references('code')->on('locales')->cascadeOnDelete();
            $table->unique(['locale', 'group', 'key', 'translatable_type', 'translatable_id'], 'translations_unique');
            $table->index(['group', 'locale']);
            $table->index(['translatable_type', 'translatable_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('translations');
    }
};
