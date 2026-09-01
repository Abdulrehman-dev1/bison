<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStaticTranslationsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('translations.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            'values' => ['required', 'array'],
            'values.*' => ['array'],
            'values.*.*' => ['nullable', 'string'],
        ];
    }
}
