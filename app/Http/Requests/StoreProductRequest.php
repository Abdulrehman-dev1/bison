<?php

namespace App\Http\Requests;

use App\Models\Locale;
use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('products.manage') ?? false;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('is_active')) {
            $this->merge([
                'is_active' => filter_var($this->input('is_active'), FILTER_VALIDATE_BOOLEAN),
            ]);
        }

        foreach (['existing_image_ids', 'removed_image_ids'] as $field) {
            if ($this->has($field) && ! is_array($this->input($field))) {
                $this->merge([$field => []]);
            }
        }
    }

    public function rules(): array
    {
        $rules = [
            'category_slug' => ['required', 'string', 'max:100'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
            'images' => ['nullable', 'array', 'max:12'],
            'images.*' => ['image', 'mimes:jpeg,png,webp', 'max:5120'],
            'existing_image_ids' => ['nullable', 'array'],
            'existing_image_ids.*' => ['integer'],
            'removed_image_ids' => ['nullable', 'array'],
            'removed_image_ids.*' => ['integer'],
            'translations' => ['required', 'array'],
        ];

        foreach (Locale::activeCodes() as $locale) {
            $rules["translations.{$locale}.name"] = ['required', 'string', 'max:255'];
            $rules["translations.{$locale}.description"] = ['required', 'string'];
            $rules["translations.{$locale}.slug"] = ['nullable', 'string', 'max:255'];
            $rules["translations.{$locale}.meta_title"] = ['nullable', 'string', 'max:255'];
            $rules["translations.{$locale}.meta_description"] = ['nullable', 'string'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'images.max' => 'You can upload up to 12 images per product.',
            'images.*.max' => 'Each image must be 5 MB or smaller.',
            'images.*.image' => 'Only JPG, PNG, or WebP images are allowed.',
            'images.*.mimes' => 'Only JPG, PNG, or WebP images are allowed.',
        ];
    }
}
