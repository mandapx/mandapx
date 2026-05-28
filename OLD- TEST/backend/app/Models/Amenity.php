<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Amenity extends Model
{
    protected $fillable = ['name','icon','category','active'];
    protected $casts    = ['active' => 'boolean'];
    public function venues() { return $this->belongsToMany(Venue::class, 'venue_amenities'); }
}
