<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class PushController extends Controller
{
    // Method untuk menyimpan push subscription ke user
    public function subscribe(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'endpoint' => 'required|string',
            'keys.auth' => 'required|string',
            'keys.p256dh' => 'required|string',
        ]);

        $user->updatePushSubscription(
            $request->endpoint,
            $request->input('keys.p256dh'),
            $request->input('keys.auth')
        );

        return response()->json(['message' => 'Push subscription saved.']);
    }

    // Method untuk mengirim notifikasi ke semua user yang berlangganan
    public function send(Request $request)
    {
        $payload = json_encode([
            'title' => $request->input('title', 'Notifikasi Baru!'),
            'body'  => $request->input('body', 'Ini adalah pesan notifikasi dari Laravel.'),
        ]);

        $auth = [
            'VAPID' => [
                'subject' => 'mailto:admin@example.com',
                'publicKey' => config('webpush.vapid.public_key'),
                'privateKey' => config('webpush.vapid.private_key'),
            ],
        ];

        $webPush = new WebPush($auth);
        $users = User::whereHas('pushSubscriptions')->get();

        foreach ($users as $user) {
            foreach ($user->pushSubscriptions as $sub) {
                $subscription = Subscription::create([
                    'endpoint' => $sub->endpoint,
                    'publicKey' => $sub->public_key,
                    'authToken' => $sub->auth_token,
                    'contentEncoding' => $sub->content_encoding,
                ]);

                try {
                    $webPush->sendOneNotification($subscription, $payload);
                } catch (\Exception $e) {
                    Log::error('Gagal mengirim notifikasi: ' . $e->getMessage());
                }
            }
        }

        return response()->json(['message' => 'Notifikasi dikirim.']);
    }
}
