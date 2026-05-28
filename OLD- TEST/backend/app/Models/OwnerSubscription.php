<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OwnerSubscription extends Model
{
    protected $fillable = [
        'user_id','plan_id','billing_cycle','status',
        'razorpay_subscription_id','amount','starts_at','ends_at','cancelled_at',
    ];
    protected $casts = ['starts_at'=>'datetime','ends_at'=>'datetime','cancelled_at'=>'datetime'];
    public function user() { return $this->belongsTo(User::class); }
    public function plan() { return $this->belongsTo(SubscriptionPlan::class, 'plan_id'); }
    public function isActive(): bool { return $this->status === 'active' && now()->lt($this->ends_at); }
}
