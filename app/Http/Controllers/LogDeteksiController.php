<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LogDeteksi;

class LogDeteksiController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'nullable|string',
            'tipe' => 'required|in:unknown,known',
            'waktu' => 'required|date',
            'sumber' => 'required|in:komputasi,esp32',
        ]);

        $log = LogDeteksi::create([
            'nama' => $request->nama,
            'tipe' => $request->tipe,
            'waktu' => $request->waktu,
            'sumber' => $request->sumber,
        ]);

        return response()->json(['success' => true, 'data' => $log]);
    }

    public function index()
    {
        // Hanya tampilkan log dari unit komputasi
        return LogDeteksi::where('sumber', 'komputasi')->latest()->get();
    }
}
