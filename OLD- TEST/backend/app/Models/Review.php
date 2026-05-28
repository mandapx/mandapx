<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'booking_id', 'venue_id', 'user_id', 'rating', 'title',
        'body', 'photos', 'helpful_count', 'owner_reply', 'owner_replied_at', 'status',
    ];

    protected $casts = [
        'photos'           => 'array',
        'owner_replied_at' => 'datetime',
    ];

    public function user()    { return $this->belongsTo(User::class); }
    public function venue()   { return $this->belongsTo(Venue::class); }
    public function booking() { return $this->belongsTo(Booking::class); }
}
