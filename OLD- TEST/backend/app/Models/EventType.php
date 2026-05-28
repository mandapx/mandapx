<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventType extends Model
{
    protected $fillable = ['name','slug','icon','image','category','active','sort_order'];
    protected $casts    = ['active' => 'boolean'];
    public function venues() { return $this->belongsToMany(Venue::class, 'venue_event_types'); }
}
