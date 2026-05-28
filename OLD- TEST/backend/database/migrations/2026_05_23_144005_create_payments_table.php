<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('restrict');
            $table->foreignId('user_id')->constrained()->onDelete('restrict');
            $table->decimal('amount', 12, 2);
            $table->string('currency', 5)->default('INR');
            $table->enum('type', ['deposit', 'full', 'refund'])->default('deposit');
            $table->enum('gateway', ['razorpay'])->default('razorpay');
            $table->string('gateway_order_id')->nullable();
            $table->string('gateway_payment_id')->nullable();
            $table->string('gateway_signature')->nullable();
            $table->enum('status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');
            $table->json('gateway_response')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('payments');
    }
};
