<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WajahDikenalController;
use App\Http\Controllers\LogDeteksiController;
use App\Http\Controllers\Esp32TriggerController;
use App\Http\Controllers\PushController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/push-subscribe', [PushController::class, 'subscribe']);
    Route::post('/push-send', [PushController::class, 'send']);
});


// Endpoint untuk manajemen wajah dikenal
Route::get('/wajah-dikenal', [WajahDikenalController::class, 'index']);
Route::post('/wajah-dikenal', [WajahDikenalController::class, 'store']);
Route::put('/wajah-dikenal/{id}', [WajahDikenalController::class, 'update']);
Route::delete('/wajah-dikenal/{id}', [WajahDikenalController::class, 'destroy']);

Route::post('/log-deteksi', [LogDeteksiController::class, 'store']);
Route::get('/log-deteksi', [LogDeteksiController::class, 'index']);
Route::post('/esp32-trigger', [Esp32TriggerController::class, 'trigger']);
