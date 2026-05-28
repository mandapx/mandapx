<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('venues', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('venue_owners')->onDelete('cascade');
            $table->foreignId('city_id')->constrained('cities')->onDelete('restrict');
            $table->foreignId('type_id')->constrained('venue_types')->onDelete('restrict');
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('area')->nullable();
            $table->text('address');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            // Capacity
            $table->unsignedInteger('capacity_min')->default(10);
            $table->unsignedInteger('capacity_max')->default(100);
            // Pricing
            $table->decimal('price_per_plate', 10, 2)->nullable();
            $table->decimal('flat_rent_price', 12, 2)->nullable();
            $table->decimal('price_min', 12, 2)->nullable();
            // Category
            $table->enum('category', ['indoor', 'outdoor', 'both'])->default('indoor');
            // Facilities
            $table->boolean('parking_available')->default(false);
            $table->unsignedInteger('parking_count')->default(0);
            $table->boolean('power_backup')->default(false);
            $table->unsignedInteger('rooms_count')->default(0);
            $table->boolean('alcohol_allowed')->default(false);
            $table->boolean('dj_allowed')->default(false);
            // Catering & Decoration
            $table->enum('catering_type', ['inhouse', 'external', 'both', 'monopoly'])->default('inhouse');
            $table->string('catering_details')->nullable();
            $table->enum('decoration_type', ['inhouse', 'external', 'both', 'monopoly'])->default('inhouse');
            $table->string('decoration_details')->nullable();
            // Status & Moderation
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected', 'suspended'])->default('draft');
            $table->text('rejection_reason')->nullable();
            $table->boolean('featured')->default(false);
            $table->unsignedInteger('views_count')->default(0);
            $table->decimal('avg_rating', 3, 2)->default(0.00);
            $table->unsignedInteger('reviews_count')->default(0);
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void {
        Schema::dropIfExists('venues');
    }
};
