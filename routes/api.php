<?php 

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

Route::post('/notifikasi', function (Request $request) {
    $pesan = $request->input('pesan');

    // Simpan log ke database (jika ada tabelnya)
    // DB::table('log_deteksi')->insert([...]);

    // Simpan ke log file
    Log::channel('daily')->info('[Deteksi]', ['pesan' => $pesan]);

    // Kirim Telegram atau lainnya (jika ingin)
    // Notification::route('telegram', 'chat_id')->notify(new NotifikasiDeteksi($pesan));

    return response()->json(['status' => 'OK', 'message' => $pesan]);
});
