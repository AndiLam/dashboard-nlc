<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LogDeteksi;
use App\Helpers\PushNotification;

class Esp32TriggerController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'waktu' => 'required|date',
        ]);

        $log = LogDeteksi::create([
            'nama' => null,
            'tipe' => 'unknown',
            'waktu' => $request->waktu,
            'sumber' => 'esp32',
        ]);

        // Kirim push notif
        PushNotification::send('Deteksi Tidak Dikenal!', 'Wajah tidak dikenal terdeteksi!');


        return response()->json(['success' => true, 'data' => $log]);
    }
}
