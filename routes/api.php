<?php 

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AlarmScheduleController;
use Illuminate\Support\Facades\Http;
use App\Models\Log as LogModel;

Route::get('/alarm/schedule', [AlarmScheduleController::class, 'index']);
Route::post('/alarm/schedule', [AlarmScheduleController::class, 'store']);
Route::post('/alarm/schedule/{id}/deactivate', [AlarmScheduleController::class, 'deactivate']);


Route::prefix('/esp32')->middleware(['auth'])->group(function () {
    Route::get('/status', function () {
        try {
            $response = Http::timeout(2)->get('http://192.168.191.1/status');
            return response()->json($response->json());
        } catch (\Exception $e) {
            return response()->json(['error' => 'ESP32 tidak terhubung'], 500);
        }
    });

    Route::get('/alarm/{action}', function ($action) {
        try {
            $response = Http::timeout(2)->get("http://192.168.191.1/alarm/{$action}");
            return response()->json($response->json());
        } catch (\Exception $e) {
            return response()->json(['error' => 'ESP32 gagal diakses'], 500);
        }
    });

    Route::get('/alarm/stop-sound', function () {
        try {
            $response = Http::timeout(2)->get("http://192.168.191.1/alarm/stop-sound");
            return response()->json($response->json());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal mematikan alarm'], 500);
        }
    });

    Route::post('/alarm/schedule', function (Request $request) {
        try {
            $response = Http::timeout(2)->post('http://192.168.191.1/alarm/schedule', [
                'time_on' => $request->time_on,
                'time_off' => $request->time_off,
            ]);
            return response()->json($response->json());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal mengirim jadwal ke ESP32'], 500);
        }
    });
});

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
