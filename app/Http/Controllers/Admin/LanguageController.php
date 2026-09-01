<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLocaleRequest;
use App\Http\Requests\UpdateLocaleRequest;
use App\Models\Locale;
use App\Services\AuditService;
use App\Services\TranslationService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LanguageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Languages/Index', [
            'locales' => Locale::query()->ordered()->get(),
        ]);
    }

    public function store(StoreLocaleRequest $request, TranslationService $translations): RedirectResponse
    {
        $data = $request->validated();

        Locale::query()->create([
            'code' => $data['code'],
            'name' => $data['name'],
            'native_name' => $data['native_name'],
            'is_active' => $data['is_active'] ?? true,
            'is_default' => false,
            'sort_order' => (Locale::query()->max('sort_order') ?? 0) + 1,
        ]);

        if ($request->boolean('copy_from_default')) {
            $from = Locale::defaultCode();
            $copied = $translations->copyLocale($from, $data['code']);
            AuditService::log('language.created', "Added language \"{$data['code']}\" with {$copied} strings copied from {$from}.");
        } else {
            AuditService::log('language.created', "Added language \"{$data['code']}\".");
        }

        return redirect()->route('admin.languages.index')->with('success', 'Language added successfully.');
    }

    public function update(UpdateLocaleRequest $request, string $code): RedirectResponse
    {
        $locale = Locale::query()->findOrFail($code);
        $data = $request->validated();

        if (($data['is_default'] ?? false) && ! $locale->is_default) {
            Locale::query()->where('is_default', true)->update(['is_default' => false]);
        }

        if ($locale->is_default && isset($data['is_active']) && ! $data['is_active']) {
            return back()->with('error', 'The default language cannot be deactivated.');
        }

        $locale->update($data);

        AuditService::log('language.updated', "Updated language \"{$locale->code}\".", $locale);

        return redirect()->route('admin.languages.index')->with('success', 'Language updated successfully.');
    }
}
