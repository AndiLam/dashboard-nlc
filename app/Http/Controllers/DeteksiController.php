<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LogDeteksi;
use Illuminate\Support\Facades\Http;

class DeteksiController extends Controller
{
    public function index(Request $request)
    {
        $query = LogDeteksi::query();

        if ($request->has('today') && $request->today == 1) {
            $query->whereDate('waktu', now()->toDateString());
        }

        if ($request->has('limit') && is_numeric($request->limit)) {
            $query->limit((int) $request->limit);
        }

        $data = $query->orderByDesc('waktu')->get();

        return response()->json([
            'total' => $data->count(),
            'data'  => $data
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama'   => 'required|string',
            'status' => 'required|in:Dikenal,Tidak Dikenal',
        ]);

        LogDeteksi::create([
            'nama'   => $request->nama,
            'status' => $request->status,
            'waktu'  => now(),
        ]);

        // Tidak membuat AlarmTriggerLog & tidak push notif di sini.
        // (Push notif hanya di AlarmController, dipicu oleh ESP32)

        return response()->json(['message' => 'Log tersimpan']);
    }
}
