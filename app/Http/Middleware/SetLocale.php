<?php

namespace App\Http\Middleware;

use App\Models\Locale;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! Schema::hasTable('locales')) {
            app()->setLocale('en');

            return $next($request);
        }

        $activeLocales = Locale::activeCodes();
        $defaultLocale = Locale::defaultCode();

        if ($activeLocales === []) {
            $activeLocales = ['en'];
            $defaultLocale = 'en';
        }

        $locale = $request->session()->get('locale');

        if (! $locale && $request->has('lang') && in_array($request->query('lang'), $activeLocales, true)) {
            $locale = $request->query('lang');
            $request->session()->put('locale', $locale);
        }

        if (! $locale) {
            $preferred = $request->getPreferredLanguage($activeLocales);
            $locale = $preferred ?: $defaultLocale;
        }

        if (! in_array($locale, $activeLocales, true)) {
            $locale = $defaultLocale;
        }

        app()->setLocale($locale);

        return $next($request);
    }
}
