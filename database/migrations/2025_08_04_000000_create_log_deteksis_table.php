<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLogDeteksisTable extends Migration
{
    public function up(): void
    {
        Schema::create('log_deteksis', function (Blueprint $table) {
            $table->id();
            $table->string('nama')->nullable();
            $table->enum('tipe', ['known', 'unknown']);
            $table->timestamp('waktu');
            $table->enum('sumber', ['komputasi', 'esp32']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('log_deteksis');
    }
}
