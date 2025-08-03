<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Helpers\PushNotification;

class PushController extends Controller
{
    public function subscribe(Request $request)
    {
        Log::info('Push subscription received:', $request->all());

        $request->validate([
            'endpoint' => 'required|string',
            'keys.auth' => 'required|string',
            'keys.p256dh' => 'required|string',
        ]);

        // Di sini bisa simpan data ke tabel push_subscriptions jika diimplementasikan

        return response()->json(['message' => 'Push subscription simulated saved.']);
    }

    public function send(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'body' => 'required|string',
        ]);

        PushNotification::send($request->title, $request->body);

        return response()->json(['message' => 'Notifikasi dikirim.']);
    }
}