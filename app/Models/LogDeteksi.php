<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogDeteksi extends Model
{
    protected $fillable = [
        'nama',
        'tipe',     // known | unknown
        'waktu',
        'sumber',   // komputasi | esp32
    ];

    public $timestamps = false;
}
