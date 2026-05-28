<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class VenueCategory extends Model
{
    protected $fillable = [
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

    public function subcategories(): HasMany
    {
        return $this->hasMany(VenueSubcategory::class, 'category_id')->orderBy('sort_order');
    }

    public function venueTypes(): HasManyThrough
    {
        return $this->hasManyThrough(
            VenueType::class,
            VenueSubcategory::class,
            'category_id',
            'subcategory_id',
            'id',
            'id'
        );
    }
}
