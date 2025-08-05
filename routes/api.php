<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WajahDikenalController;
use App\Http\Controllers\DeteksiController;
use App\Http\Controllers\Esp32TriggerController;
use App\Http\Controllers\AlarmController;
use App\Http\Controllers\PushController;

Route::middleware(['web', 'auth:sanctum'])->group(function () {
    Route::post('/push-subscribe', [PushController::class, 'subscribe']);
    Route::post('/push-send', [PushController::class, 'send']);
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
    Route::get('/status', [Esp32TriggerController::class, 'status']);
    Route::get('/alarm/on', [Esp32TriggerController::class, 'turnOn']);
    Route::get('/alarm/off', [Esp32TriggerController::class, 'turnOff']);
    Route::get('/alarm/stop-sound', [Esp32TriggerController::class, 'stopSound']);
    Route::post('/alarm/schedule', [Esp32TriggerController::class, 'setSchedule']);
});

Route::get('/jadwal-log', [AlarmController::class, 'jadwalLog']);
Route::get('/alarm-trigger-log', [AlarmController::class, 'triggerLog']);
Route::post('/alarm-trigger-log', [AlarmController::class, 'storeTriggerLog']);
