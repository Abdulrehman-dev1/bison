<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Translation extends Model
{
    protected $fillable = [
        'locale',
        'group',
        'key',
        'value',
        'translatable_type',
        'translatable_id',
        'updated_by',
    ];

    public function localeModel(): BelongsTo
    {
        return $this->belongsTo(Locale::class, 'locale', 'code');
    }

    public function translatable(): MorphTo
    {
        return $this->morphTo();
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function scopeStatic($query)
    {
        return $query->where('translatable_type', '')->where('translatable_id', 0);
    }

    public function scopeForModel($query, Model $model)
    {
        return $query
            ->where('translatable_type', $model::class)
            ->where('translatable_id', $model->getKey());
    }
}
