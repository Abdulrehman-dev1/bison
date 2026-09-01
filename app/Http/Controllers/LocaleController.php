<?php

namespace App\Http\Controllers;

use App\Models\Locale;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LocaleController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $activeLocales = Locale::activeCodes();

        $locale = $request->validate([
            'locale' => ['required', 'in:'.implode(',', $activeLocales ?: ['en'])],
        ])['locale'];

        $request->session()->put('locale', $locale);

        return back();
    }
}
