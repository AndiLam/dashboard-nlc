<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JadwalAlarmLog;
use App\Models\AlarmTriggerLog;
use App\Services\MqttService;
use App\Helpers\PushNotification;
use Illuminate\Support\Facades\Validator;

class AlarmController extends Controller
{
    protected $mqtt;

    public function __construct(MqttService $mqtt)
    {
        $this->mqtt = $mqtt;
    }

    // Ambil 10 log jadwal alarm terbaru
    public function jadwalLog()
    {
        return response()->json(JadwalAlarmLog::latest()->take(10)->get());
    }

    // Ambil 10 log trigger alarm terbaru
    public function triggerLog()
    {
        return response()->json(AlarmTriggerLog::latest()->take(10)->get());
    }

    // Simpan trigger log baru dan kirim push notif
    public function storeTriggerLog(Request $request)
    {
        $request->validate([
            'sumber_trigger' => 'nullable|string|max:255',
        ]);

        $log = AlarmTriggerLog::create([
            'sumber_trigger' => $request->sumber_trigger ?? 'Sistem',
        ]);

        PushNotification::send("🚨 Alarm Aktif!", "Deteksi dari: " . $log->sumber_trigger);

        return response()->json([
            'message' => 'Log alarm berhasil dicatat.',
            'data' => $log,
        ]);
    }

    // Kirim perintah ke ESP32 via MQTT (on/off/stop-sound)
    public function sendCommand(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'action' => 'required|in:on,off,stop-sound',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Perintah tidak valid'], 422);
        }

        try {
            $this->mqtt->publishControlMessage($request->action);
            return response()->json(['message' => 'Perintah ' . $request->action . ' berhasil dikirim via MQTT']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal mengirim perintah MQTT: ' . $e->getMessage()], 500);
        }
    }
}
