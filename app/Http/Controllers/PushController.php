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

        $user = $request->user(); 

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Simpan subscription via trait HasPushSubscriptions
        $user->updatePushSubscription(
            $request->endpoint,
            $request->keys['p256dh'],
            $request->keys['auth'],
            $request->header('Content-Encoding', 'aes128gcm') // default content encoding
        );

        return response()->json(['message' => 'Push subscription saved']);
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