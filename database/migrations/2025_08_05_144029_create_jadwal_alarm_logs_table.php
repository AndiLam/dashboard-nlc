<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('jadwal_alarm_logs', function (Blueprint $table) {
            $table->id();
            $table->time('waktu_on');
            $table->time('waktu_off');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jadwal_alarm_logs');
    }
};
