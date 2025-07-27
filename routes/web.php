<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminDashboardController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'dashboard'])->name('dashboard');
    Route::get('/alarm', [AdminDashboardController::class, 'alarm'])->name('alarm');
    Route::get('/log-deteksi', [AdminDashboardController::class, 'log'])->name('log');
    Route::get('/wajah-dikenal', [AdminDashboardController::class, 'wajah'])->name('wajah');
    Route::get('/notifikasi', [AdminDashboardController::class, 'notifikasi'])->name('notifikasi');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__.'/auth.php';

