<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AlarmSchedule;

class AlarmScheduleController extends Controller
{
    public function index()
    {
        return response()->json(AlarmSchedule::where('is_active', true)->latest()->first());
    }

    public function store(Request $request)
    {
        $request->validate([
            'start_time' => 'required|date_format:H:i',
            'end_time'   => 'required|date_format:H:i',
        ]);

        // Nonaktifkan jadwal sebelumnya jika mau 1 aktif saja
        AlarmSchedule::query()->update(['is_active' => false]);

        $schedule = AlarmSchedule::create([
            'start_time' => $request->start_time,
            'end_time'   => $request->end_time,
            'is_active'  => true
        ]);

        return response()->json([
            'message' => 'Jadwal alarm disimpan.',
            'data' => $schedule
        ]);
    }

    public function deactivate($id)
    {
        $schedule = AlarmSchedule::findOrFail($id);
        $schedule->is_active = false;
        $schedule->save();

        return response()->json(['message' => 'Jadwal dinonaktifkan.']);
    }
}
