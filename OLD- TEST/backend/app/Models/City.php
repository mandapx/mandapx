<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    protected $fillable = ['name', 'state', 'country', 'slug', 'image', 'featured', 'venue_count'];
    protected $casts    = ['featured' => 'boolean'];
    public function venues() { return $this->hasMany(Venue::class); }
}
