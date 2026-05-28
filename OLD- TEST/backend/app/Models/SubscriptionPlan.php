<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    protected $fillable = [
        'name', 'slug', 'description', 'price_monthly', 'price_yearly',
        'max_venues', 'max_photos_per_venue', 'featured_listing',
        'priority_support', 'analytics_access', 'commission_rate',
        'features', 'razorpay_plan_id_monthly', 'razorpay_plan_id_yearly',
        'active', 'sort_order',
    ];

    protected $casts = [
        'features'          => 'array',
        'featured_listing'  => 'boolean',
        'priority_support'  => 'boolean',
        'analytics_access'  => 'boolean',
        'active'            => 'boolean',
    ];

    public function subscriptions() { return $this->hasMany(OwnerSubscription::class, 'plan_id'); }
}
