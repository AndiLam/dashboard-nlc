<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('alarm_schedules', function (Blueprint $table) {
            $table->id();
            $table->time('start_time');   // waktu mulai aktif
            $table->time('end_time');     // waktu nonaktif
            $table->boolean('is_active')->default(true); // untuk aktif/nonaktif jadwal
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alarm_schedules');
    }
};
