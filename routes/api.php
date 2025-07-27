<?php 

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AlarmScheduleController;
use App\Models\Log as LogModel;

Route::get('/alarm/schedule', [AlarmScheduleController::class, 'index']);
Route::post('/alarm/schedule', [AlarmScheduleController::class, 'store']);
Route::post('/alarm/schedule/{id}/deactivate', [AlarmScheduleController::class, 'deactivate']);

Route::post('/notifikasi', function (Request $request) {
    $pesan = $request->input('pesan', 'Tidak ada pesan');
    $nama = $request->input('nama', 'Tidak dikenal');
    $status = $request->input('status', 'Ditolak');
    $waktu = $request->input('waktu', now());

    // Simpan ke database (tabel logs)
    LogModel::create([
        'nama' => $nama,
        'waktu_deteksi' => $waktu,
        'status' => $status,
    ]);

    // Simpan ke log file Laravel
    Log::channel('daily')->info('[Deteksi]', [
        'nama' => $nama,
        'waktu' => $waktu,
        'status' => $status,
        'pesan' => $pesan,
    ]);

    // (Opsional) Kirim ke Telegram atau notifikasi lainnya
    // Notification::route('telegram', 'chat_id')->notify(new NotifikasiDeteksi($pesan));

    return response()->json([
        'status' => 'OK',
        'message' => 'Log deteksi berhasil disimpan.',
        'data' => [
            'nama' => $nama,
            'waktu' => $waktu,
            'status' => $status,
        ]
    ]);
});
