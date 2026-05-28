<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VenueAvailability extends Model
{
    protected $fillable = ['venue_id','date','status','note'];
    protected $casts    = ['date' => 'date'];
    public function venue() { return $this->belongsTo(Venue::class); }
}
