<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminDashboardController;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;
use App\Helpers\PushNotification;



Route::redirect('/', '/login');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'dashboard'])->name('dashboard');
    Route::get('/streaming', [AdminDashboardController::class, 'streaming'])->name('streaming');
    Route::get('/alarm', [AdminDashboardController::class, 'alarm'])->name('alarm');
    Route::get('/log-deteksi', [AdminDashboardController::class, 'log'])->name('log');
    Route::get('/wajah-dikenal', [AdminDashboardController::class, 'wajah'])->name('wajah');
    //Route::get('/notifikasi', [AdminDashboardController::class, 'notifikasi'])->name('notifikasi');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::get('/uji-push', function () {
    PushNotification::send('Uji Notifikasi', 'Ada Wajah Tidak Dikenal');
    return 'Notifikasi dikirim.';
});


//stream
Route::get('/stream/{filename}', function ($filename) {
    $path = public_path('stream/' . $filename);

    if (!file_exists($path)) {
        abort(404);
    }

    $mime = match (pathinfo($path, PATHINFO_EXTENSION)) {
        'm3u8' => 'application/vnd.apple.mpegurl',
        'ts' => 'video/mp2t',
        default => 'application/octet-stream',
    };

    return Response::file($path, [
        'Content-Type' => $mime,
    ]);
})->where('filename', '.*');

require __DIR__.'/auth.php';

