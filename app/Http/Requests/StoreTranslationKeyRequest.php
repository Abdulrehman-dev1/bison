<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTranslationKeyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('translations.manage') ?? false;
    }

    public function rules(): array
    {
        $group = $this->route('group');

        return [
            'key' => [
                'required',
                'string',
                'max:191',
                'regex:/^[a-z0-9_.-]+$/i',
                Rule::unique('translations', 'key')
                    ->where(fn ($query) => $query
                        ->where('group', $group)
                        ->where('translatable_type', '')
                        ->where('translatable_id', 0)),
            ],
            'default_value' => ['nullable', 'string'],
            'values' => ['nullable', 'array'],
            'values.*' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'key.regex' => 'Key may only contain letters, numbers, dots, dashes, and underscores.',
            'key.unique' => 'This key already exists in this group.',
        ];
    }
}
