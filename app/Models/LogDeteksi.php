<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogDeteksi extends Model
{
    protected $fillable = [
        'nama',
        'status',
        'waktu',
    ];

    public $timestamps = true;

    protected $table = 'log_deteksi';
}
