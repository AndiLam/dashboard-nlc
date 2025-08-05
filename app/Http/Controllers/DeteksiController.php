<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LogDeteksi;
use App\Models\AlarmTriggerLog;
use App\Helpers\PushNotification;
use Illuminate\Support\Facades\Http;

class DeteksiController extends Controller
{
    public function index()
    {
        return LogDeteksi::orderByDesc('waktu')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string',
            'status' => 'required|in:Dikenal,Tidak Dikenal',
        ]);

        // Simpan log deteksi
        $log = LogDeteksi::create([
            'nama' => $request->nama,
            'status' => $request->status,
            'waktu' => now(),
        ]);

        try {
            // Cek status alarm dari ESP32
            $response = Http::timeout(2)->get(config('app.local_esp32_url') . '/status-alarm');
            $alarmAktif = $response->successful() && $response->json('aktif');

            // Jika alarm aktif dan wajah tidak dikenal
            if ($request->status === 'Tidak Dikenal' && $alarmAktif) {
                // Simpan log alarm menyala
                AlarmTriggerLog::create([
                    'sumber_trigger' => 'Deteksi Wajah Tidak Dikenal',
                ]);

                // Kirim notifikasi
                PushNotification::send(
                    'Wajah Tidak Dikenal!',
                    'Seseorang terdeteksi di area terlarang!'
                );
            }

        } catch (\Exception $e) {
            // Bisa dicatat log error jika perlu
        }

        return response()->json(['message' => 'Log tersimpan']);
    }
}
