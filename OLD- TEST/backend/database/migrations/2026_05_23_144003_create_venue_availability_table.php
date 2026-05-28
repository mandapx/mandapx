<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('venue_availability', function (Blueprint $table) {
            $table->id();
            $table->foreignId('venue_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->enum('status', ['open', 'blocked', 'booked'])->default('open');
            $table->string('note')->nullable();
            $table->timestamps();
            $table->unique(['venue_id', 'date']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('venue_availability');
    }
};
