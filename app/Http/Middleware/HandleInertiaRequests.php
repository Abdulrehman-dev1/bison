<?php

namespace App\Http\Middleware;

use App\Models\Locale;
use App\Services\TranslationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();
        $translationService = app(TranslationService::class);

        $availableLocales = Schema::hasTable('locales')
            ? Locale::query()->active()->ordered()->get(['code', 'native_name', 'name'])
            : collect([['code' => 'en', 'native_name' => 'English', 'name' => 'English']]);

        $translations = Schema::hasTable('translations')
            ? $translationService->getFrontendBundle(app()->getLocale())
            : [
                'nav' => __('nav'),
                'common' => __('common'),
                'pages' => __('pages'),
                'seo' => __('seo'),
            ];

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                    'roles' => $user->getRoleNames(),
                ] : null,
            ],
            'locale' => app()->getLocale(),
            'availableLocales' => $availableLocales->isNotEmpty()
                ? $availableLocales
                : collect([['code' => 'en', 'native_name' => 'English', 'name' => 'English']]),
            'translations' => $translations,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'ziggy' => fn () => [
                ...(new \Tighten\Ziggy\Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
