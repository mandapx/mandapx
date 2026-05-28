<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->foreignId('venue_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->unsignedTinyInteger('rating'); // 1-5
            $table->string('title')->nullable();
            $table->text('body');
            $table->json('photos')->nullable();
            $table->unsignedInteger('helpful_count')->default(0);
            $table->text('owner_reply')->nullable();
            $table->timestamp('owner_replied_at')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('approved');
            $table->timestamps();
            $table->unique(['booking_id', 'user_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('reviews');
    }
};
