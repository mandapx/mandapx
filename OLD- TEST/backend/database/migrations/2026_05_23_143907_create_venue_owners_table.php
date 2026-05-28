<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('venue_owners', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('business_name')->nullable();
            $table->string('gstin', 20)->nullable();
            $table->string('pan', 15)->nullable();
            $table->string('bank_account')->nullable();
            $table->string('bank_ifsc')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('account_holder_name')->nullable();
            $table->string('razorpay_contact_id')->nullable();
            $table->string('razorpay_fund_account_id')->nullable();
            $table->enum('status', ['pending', 'verified', 'rejected', 'suspended'])->default('pending');
            $table->timestamp('verified_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('venue_owners');
    }
};
