<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactSubmission extends Model
{
    protected $fillable = [
        'intent',
        'name',
        'email',
        'company',
        'detail',
        'items',
        'status',
        'ip_address',
    ];

    protected function casts(): array
    {
        return [
            'items' => 'array',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }
}
