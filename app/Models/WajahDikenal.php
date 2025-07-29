<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WajahDikenal extends Model
{
    protected $fillable = [
        'nama',
        'posisi',
        'foto', // path ke gambar
    ];
}
