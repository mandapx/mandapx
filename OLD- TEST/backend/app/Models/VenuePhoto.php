<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VenuePhoto extends Model
{
    protected $fillable = ['venue_id','url','cloudinary_public_id','caption','is_primary','sort_order'];
    protected $casts    = ['is_primary' => 'boolean'];
    public function venue() { return $this->belongsTo(Venue::class); }
}
