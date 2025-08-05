<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\JadwalAlarmLog;

class Esp32TriggerController extends Controller
{
    protected $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('app.local_esp32_url');
    }

    public function status()
    {
        try {
            $response = Http::timeout(3)->get(config('app.local_esp32_url') . '/status');
            return response()->json($response->json());
        } catch (\Exception $e) {
            return response()->json(['error' => 'ESP32 tidak terhubung'], 500);
        }
    }

    public function turnOn()
    {
        try {
            return Http::timeout(2)->get($this->baseUrl . '/alarm/on');
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal menghidupkan alarm'], 500);
        }
    }

    public function turnOff()
    {
        try {
            return Http::timeout(2)->get($this->baseUrl . '/alarm/off');
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal mematikan alarm'], 500);
        }
    }

    public function stopSound()
    {
        try {
            return Http::timeout(2)->get($this->baseUrl . '/alarm/stop-sound');
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal menghentikan suara alarm'], 500);
        }
    }

    public function setSchedule(Request $request)
    {
        $request->validate([
            'time_on' => 'required|date_format:H:i',
            'time_off' => 'required|date_format:H:i',
        ]);

        // Bandingkan jam
        $timeOn = strtotime($request->time_on);
        $timeOff = strtotime($request->time_off);

        if ($timeOn >= $timeOff) {
            return response()->json([
                'error' => 'Waktu aktif (time_on) harus lebih awal dari waktu nonaktif (time_off).'
            ], 422);
        }

        try {
            $response = Http::timeout(2)->post($this->baseUrl . '/alarm/schedule', [
                'on' => $request->time_on,
                'off' => $request->time_off,
            ]);

            if ($response->successful()) {
                // Simpan ke log jadwal
                JadwalAlarmLog::create([
                    'waktu_on' => $request->time_on,
                    'waktu_off' => $request->time_off,
                ]);
            }

            return $response;

        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal mengatur jadwal alarm'], 500);
        }
    }
}
