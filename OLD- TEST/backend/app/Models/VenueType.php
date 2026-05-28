<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VenueType extends Model
{
    protected $fillable = ['subcategory_id','name','slug','icon','image','description','active','sort_order'];
    protected $casts    = ['active' => 'boolean'];

    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(VenueSubcategory::class, 'subcategory_id');
    }

    public function venues(): HasMany
    {
        return $this->hasMany(Venue::class, 'type_id');
    }
}
