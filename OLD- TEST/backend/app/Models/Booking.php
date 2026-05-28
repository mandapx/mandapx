<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'booking_number', 'user_id', 'venue_id', 'event_type_id',
        'event_date', 'event_time', 'guest_count', 'special_requirements', 'status',
        'total_amount', 'deposit_amount', 'commission_rate', 'commission_amount',
        'accepted_at', 'declined_at', 'confirmed_at', 'completed_at',
        'cancelled_at', 'accept_deadline', 'decline_reason', 'cancellation_reason',
    ];

    protected $casts = [
        'event_date'      => 'date',
        'accepted_at'     => 'datetime',
        'declined_at'     => 'datetime',
        'confirmed_at'    => 'datetime',
        'completed_at'    => 'datetime',
        'cancelled_at'    => 'datetime',
        'accept_deadline' => 'datetime',
    ];

    protected static function boot() {
        parent::boot();
        static::creating(function ($booking) {
            $booking->booking_number = 'CMV' . strtoupper(uniqid());
            $booking->accept_deadline = now()->addHours(24);
        });
    }

    public function user()      { return $this->belongsTo(User::class); }
    public function venue()     { return $this->belongsTo(Venue::class); }
    public function eventType() { return $this->belongsTo(EventType::class); }
    public function payment()   { return $this->hasOne(Payment::class); }
    public function review()    { return $this->hasOne(Review::class); }

    public function isPending()   { return $this->status === 'pending'; }
    public function isExpired()   { return $this->isPending() && now()->gt($this->accept_deadline); }
    public function isConfirmed() { return $this->status === 'confirmed'; }
}
