<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('venue_event_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('venue_id')->constrained()->onDelete('cascade');
            $table->foreignId('event_type_id')->constrained()->onDelete('cascade');
            $table->unique(['venue_id', 'event_type_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('venue_event_types');
    }
};
