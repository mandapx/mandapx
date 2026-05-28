<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Free, Basic, Pro
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price_monthly', 10, 2)->default(0);
            $table->decimal('price_yearly', 10, 2)->default(0);
            $table->unsignedInteger('max_venues')->default(1);
            $table->unsignedInteger('max_photos_per_venue')->default(5);
            $table->boolean('featured_listing')->default(false);
            $table->boolean('priority_support')->default(false);
            $table->boolean('analytics_access')->default(false);
            $table->decimal('commission_rate', 5, 2)->default(10.00);
            $table->json('features')->nullable();
            $table->string('razorpay_plan_id_monthly')->nullable();
            $table->string('razorpay_plan_id_yearly')->nullable();
            $table->boolean('active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('subscription_plans');
    }
};
