<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_number')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('restrict');
            $table->foreignId('venue_id')->constrained()->onDelete('restrict');
            $table->foreignId('event_type_id')->nullable()->constrained()->onDelete('set null');
            $table->date('event_date');
            $table->string('event_time')->nullable();
            $table->unsignedInteger('guest_count');
            $table->text('special_requirements')->nullable();
            $table->enum('status', [
                'pending', 'accepted', 'declined', 'confirmed',
                'completed', 'cancelled', 'refunded'
            ])->default('pending');
            // Pricing
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->decimal('deposit_amount', 12, 2)->default(0);
            $table->decimal('commission_rate', 5, 2)->default(10.00);
            $table->decimal('commission_amount', 12, 2)->default(0);
            // Timestamps for flow
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('declined_at')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('accept_deadline')->nullable(); // 24hr window
            $table->text('decline_reason')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('bookings');
    }
};
