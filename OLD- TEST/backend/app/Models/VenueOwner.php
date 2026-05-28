<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VenueOwner extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'business_name', 'gstin', 'pan',
        'bank_account', 'bank_ifsc', 'bank_name', 'account_holder_name',
        'razorpay_contact_id', 'razorpay_fund_account_id',
        'status', 'verified_at', 'rejection_reason',
    ];

    protected $casts = ['verified_at' => 'datetime'];

    public function user()   { return $this->belongsTo(User::class); }
    public function venues() { return $this->hasMany(Venue::class, 'owner_id'); }
}
