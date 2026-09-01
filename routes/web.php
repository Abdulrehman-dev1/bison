<?php

use App\Http\Controllers\Admin\ContactSubmissionController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\LanguageController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\TranslationController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;

Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');

Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/brands', [PageController::class, 'brands'])->name('brands');
Route::get('/retailers', [PageController::class, 'retailers'])->name('retailers');
Route::get('/manufacturers', [PageController::class, 'manufacturers'])->name('manufacturers');
Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/contact', [PageController::class, 'contact'])->name('contact');
Route::get('/contact/request-a-quote', fn () => app(PageController::class)->contact('request'))->name('contact.request');
Route::get('/contact/become-a-partner', fn () => app(PageController::class)->contact('partner'))->name('contact.partner');
Route::get('/catalogue', [PageController::class, 'catalogue'])->name('catalogue');
Route::get('/catalogue/category/{categorySlug}', [PageController::class, 'catalogue'])->name('catalogue.category');
Route::get('/catalogue/{productSlug}', [PageController::class, 'productShow'])->name('catalogue.show');

Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:5,1')->name('contact.store');
Route::post('/locale', [LocaleController::class, 'update'])->middleware('throttle:30,1')->name('locale.update');

Route::middleware(['auth', 'permission:dashboard.view'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', DashboardController::class)->name('dashboard');

    Route::middleware('permission:submissions.view')->group(function () {
        Route::get('/submissions', [ContactSubmissionController::class, 'index'])->name('submissions.index');
        Route::get('/submissions/{submission}', [ContactSubmissionController::class, 'show'])->name('submissions.show');
        Route::patch('/submissions/{submission}', [ContactSubmissionController::class, 'update'])
            ->middleware('permission:submissions.manage')
            ->name('submissions.update');
    });

    Route::middleware('permission:products.view')->group(function () {
        Route::get('/products', [ProductController::class, 'index'])->name('products.index');
        Route::get('/products/create', [ProductController::class, 'create'])->middleware('permission:products.manage')->name('products.create');
        Route::post('/products', [ProductController::class, 'store'])->middleware('permission:products.manage')->name('products.store');
        Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->middleware('permission:products.manage')->name('products.edit');
        Route::match(['put', 'post'], '/products/{product}', [ProductController::class, 'update'])->middleware('permission:products.manage')->name('products.update');
        Route::delete('/products/{product}', [ProductController::class, 'destroy'])->middleware('permission:products.manage')->name('products.destroy');
    });

    Route::middleware('permission:users.manage')->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    });

    Route::get('/roles', [RoleController::class, 'index'])->middleware('permission:roles.manage')->name('roles.index');
    Route::get('/roles/create', [RoleController::class, 'create'])->middleware('permission:roles.manage')->name('roles.create');
    Route::post('/roles', [RoleController::class, 'store'])->middleware('permission:roles.manage')->name('roles.store');
    Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])->middleware('permission:roles.manage')->name('roles.edit');
    Route::put('/roles/{role}', [RoleController::class, 'update'])->middleware('permission:roles.manage')->name('roles.update');
    Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->middleware('permission:roles.manage')->name('roles.destroy');

    Route::middleware('permission:audit.view')->group(function () {
        Route::get('/audit', [\App\Http\Controllers\Admin\AuditLogController::class, 'index'])->name('audit.index');
        Route::get('/audit/{audit}', [\App\Http\Controllers\Admin\AuditLogController::class, 'show'])->name('audit.show');
    });

    Route::middleware('permission:languages.view')->group(function () {
        Route::get('/languages', [LanguageController::class, 'index'])->name('languages.index');
        Route::post('/languages', [LanguageController::class, 'store'])
            ->middleware('permission:languages.manage')
            ->name('languages.store');
        Route::put('/languages/{code}', [LanguageController::class, 'update'])
            ->middleware('permission:languages.manage')
            ->name('languages.update');
    });

    Route::middleware('permission:translations.view')->group(function () {
        Route::get('/translations', [TranslationController::class, 'index'])->name('translations.index');
        Route::get('/translations/categories', [TranslationController::class, 'categories'])->name('translations.categories');
        Route::put('/translations/categories/{category}', [TranslationController::class, 'updateCategory'])
            ->middleware('permission:translations.manage')
            ->name('translations.categories.update');
        Route::get('/translations/static/{group}', [TranslationController::class, 'edit'])
            ->where('group', '[a-z0-9.]+')
            ->name('translations.edit');
        Route::put('/translations/static/{group}', [TranslationController::class, 'update'])
            ->middleware('permission:translations.manage')
            ->where('group', '[a-z0-9.]+')
            ->name('translations.update');
        Route::post('/translations/static/{group}/keys', [TranslationController::class, 'storeKey'])
            ->middleware('permission:translations.manage')
            ->where('group', '[a-z0-9.]+')
            ->name('translations.keys.store');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
