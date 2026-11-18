<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'detail' => ['nullable', 'string', 'max:5000', 'required_without:items'],
            'intent' => ['required', 'in:general,request,partner'],
            'items' => ['nullable', 'array', 'max:80'],
            'items.*.sku' => ['required', 'string', 'max:64'],
            'items.*.name' => ['required', 'string', 'max:200'],
            'items.*.variant' => ['nullable', 'string', 'max:120'],
            'items.*.qty' => ['nullable', 'string', 'max:10'],
            'items.*.line' => ['nullable', 'string', 'max:40'],
            'items.*.image' => ['nullable', 'string', 'regex:/^\/catalog\/[A-Za-z0-9._-]+$/'],
        ];
    }
}
