<?php 

use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WajahDikenalController;



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


//daftar wajah
Route::get('/wajah-dikenal', [WajahDikenalController::class, 'index']);
Route::post('/wajah-dikenal', [WajahDikenalController::class, 'store']);
Route::put('/wajah-dikenal/{id}', [WajahDikenalController::class, 'update']);
Route::delete('/wajah-dikenal/{id}', [WajahDikenalController::class, 'destroy']);
