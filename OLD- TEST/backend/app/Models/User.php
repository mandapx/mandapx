<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name', 'email', 'phone', 'password', 'role',
        'avatar', 'status', 'otp', 'otp_expires_at',
    ];

    protected $hidden = ['password', 'remember_token', 'otp'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'phone_verified_at' => 'datetime',
        'otp_expires_at'    => 'datetime',
    ];

    public function isAdmin(): bool    { return $this->role === 'admin'; }
    public function isOwner(): bool    { return $this->role === 'owner'; }
    public function isUser(): bool     { return $this->role === 'user'; }

    public function venueOwner()      { return $this->hasOne(VenueOwner::class); }
    public function bookings()        { return $this->hasMany(Booking::class); }
    public function reviews()         { return $this->hasMany(Review::class); }
    public function wishlists()       { return $this->hasMany(Wishlist::class); }
    public function subscription()    { return $this->hasOne(OwnerSubscription::class)->latest(); }
    public function supportTickets()  { return $this->hasMany(SupportTicket::class); }
}
