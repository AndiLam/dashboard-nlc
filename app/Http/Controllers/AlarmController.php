<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JadwalAlarmLog;
use App\Models\AlarmTriggerLog;
use App\Helpers\PushNotification;


class AlarmController extends Controller
{
    public function jadwalLog()
    {
        return response()->json(JadwalAlarmLog::latest()->take(10)->get());
    }

    public function triggerLog()
    {
        return response()->json(AlarmTriggerLog::latest()->take(10)->get());
    }

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
}
