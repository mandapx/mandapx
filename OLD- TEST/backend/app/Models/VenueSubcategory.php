<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VenueSubcategory extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'icon',
        'image',
        'description',
        'sort_order',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(VenueCategory::class, 'category_id');
    }

    public function venueTypes(): HasMany
    {
        return $this->hasMany(VenueType::class, 'subcategory_id')->orderBy('sort_order');
    }
}
