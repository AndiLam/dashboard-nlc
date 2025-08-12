<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;
use App\Http\Controllers\WajahDikenalController;
use App\Http\Controllers\DeteksiController;
use App\Http\Controllers\Esp32TriggerController;
use App\Http\Controllers\AlarmController;
use App\Http\Controllers\PushController;
use App\Http\Controllers\UploadHLSController;


Route::middleware(['web', 'auth:sanctum'])->group(function () {
    Route::post('/push-subscribe', [PushController::class, 'subscribe']);
    Route::post('/push-send', [PushController::class, 'send']);
});

Route::get('/push-count', [PushController::class, 'count']);
Route::get('/stream-status', function () {
    $playlistPath = public_path('stream/playlist.m3u8');

    $status = 'Offline';
    if (File::exists($playlistPath)) {
        $lastModified = File::lastModified($playlistPath);
        if (time() - $lastModified <= 5) {
            $status = 'Online';
        }
    }

    return response()->json([
        'data' => [
            ['value' => $status]
        ]
    ]);
});


// Endpoint untuk manajemen wajah dikenal
Route::get('/wajah-dikenal', [WajahDikenalController::class, 'index']);
Route::post('/wajah-dikenal', [WajahDikenalController::class, 'store']);
Route::put('/wajah-dikenal/{id}', [WajahDikenalController::class, 'update']);
Route::delete('/wajah-dikenal/{id}', [WajahDikenalController::class, 'destroy']);

Route::post('/log-deteksi', [DeteksiController::class, 'store']);
Route::get('/log-deteksi', [DeteksiController::class, 'index']);


use Illuminate\Support\Facades\Http;

Route::prefix('esp32')->group(function () {
    Route::get('/alarm/on', [Esp32TriggerController::class, 'turnOn']);
    Route::get('/alarm/off', [Esp32TriggerController::class, 'turnOff']);
});

Route::get('/log-alarm', [AlarmController::class, 'triggerLog']);
Route::post('/log-alarm', [AlarmController::class, 'storeTriggerLog']);


Route::post('/upload-hls', [UploadHLSController::class, 'upload']);
