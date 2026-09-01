<?php

namespace Database\Seeders;

use App\Models\Locale;
use Illuminate\Database\Seeder;

class LocaleSeeder extends Seeder
{
    public function run(): void
    {
        Locale::query()->updateOrCreate(
            ['code' => 'en'],
            [
                'name' => 'English',
                'native_name' => 'English',
                'is_active' => true,
                'is_default' => true,
                'sort_order' => 1,
            ]
        );

        Locale::query()->updateOrCreate(
            ['code' => 'es'],
            [
                'name' => 'Spanish',
                'native_name' => 'Español',
                'is_active' => true,
                'is_default' => false,
                'sort_order' => 2,
            ]
        );
    }
}
