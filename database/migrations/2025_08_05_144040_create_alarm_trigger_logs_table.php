<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('alarm_trigger_logs', function (Blueprint $table) {
            $table->id();
            $table->string('sumber_trigger')->nullable();
            $table->string('pesan')->nullable(); // Deskripsi atau pesan alarm
            $table->enum('status', ['ON', 'OFF'])->default('ON'); // Status alarm saat log dicatat
            $table->timestamps(); // created_at = waktu trigger, updated_at jarang dipakai
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alarm_trigger_logs');
    }
};
