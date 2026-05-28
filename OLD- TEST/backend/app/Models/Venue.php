<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Venue extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id', 'city_id', 'type_id', 'name', 'slug', 'description',
        'area', 'address', 'latitude', 'longitude',
        'capacity_min', 'capacity_max', 'price_per_plate', 'flat_rent_price', 'price_min',
        'category', 'parking_available', 'parking_count', 'power_backup', 'rooms_count',
        'alcohol_allowed', 'dj_allowed', 'catering_type', 'catering_details',
        'decoration_type', 'decoration_details', 'status', 'rejection_reason',
        'featured', 'views_count', 'avg_rating', 'reviews_count', 'approved_at',
    ];

    protected $casts = [
        'parking_available' => 'boolean',
        'power_backup'      => 'boolean',
        'alcohol_allowed'   => 'boolean',
        'dj_allowed'        => 'boolean',
        'featured'          => 'boolean',
        'approved_at'       => 'datetime',
    ];

    public function owner()        { return $this->belongsTo(VenueOwner::class, 'owner_id'); }
    public function city()         { return $this->belongsTo(City::class); }
    public function type()         { return $this->belongsTo(VenueType::class, 'type_id'); }
    public function category()     { return $this->hasOneThrough(VenueCategory::class, VenueSubcategory::class, 'id', 'id', 'type.subcategory_id', 'id'); }
    public function eventTypes()   { return $this->belongsToMany(EventType::class, 'venue_event_types'); }
    public function amenities()    { return $this->belongsToMany(Amenity::class, 'venue_amenities'); }
    public function photos()       { return $this->hasMany(VenuePhoto::class)->orderBy('sort_order'); }
    public function primaryPhoto() { return $this->hasOne(VenuePhoto::class)->where('is_primary', true); }
    public function availability() { return $this->hasMany(VenueAvailability::class); }
    public function bookings()     { return $this->hasMany(Booking::class); }
    public function reviews()      { return $this->hasMany(Review::class)->where('status', 'approved'); }
    public function wishlists()    { return $this->hasMany(Wishlist::class); }

    public function getIsWishlistedAttribute(): bool {
        if (!auth()->check()) return false;
        return $this->wishlists()->where('user_id', auth()->id())->exists();
    }

    public function scopeApproved($query)  { return $query->where('status', 'approved'); }
    public function scopeFeatured($query)  { return $query->where('featured', true); }
    public function scopeByCity($query, $cityId) { return $query->where('city_id', $cityId); }
}
