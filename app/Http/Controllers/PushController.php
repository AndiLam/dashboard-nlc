<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;
use App\Models\PushSubscription;

class PushController extends Controller
{
    public function subscribe(Request $request)
    {
        $data = $request->input('subscription');

        if (!$data || !isset($data['endpoint'])) {
            return response()->json(['error' => 'Invalid subscription'], 400);
        }

        // Simpan atau update jika endpoint sudah ada
        PushSubscription::updateOrCreate(
            ['endpoint' => $data['endpoint']],
            [
                'public_key' => $data['keys']['p256dh'],
                'auth_token' => $data['keys']['auth'],
                'content_encoding' => $data['contentEncoding'] ?? 'aes128gcm',
            ]
        );

        return response()->json(['success' => true]);
    }

    public function send(Request $request)
    {
        $payload = $request->input('message', 'Notifikasi dari server');

        $auth = [
            'VAPID' => [
                'subject' => 'mailto:muhammad.ilham7217@gmail.com',
                'publicKey' => config('push.public_key'),
                'privateKey' => config('push.private_key'),
            ],
        ];

        $webPush = new WebPush($auth['VAPID']);

        $subscriptions = PushSubscription::all();
        foreach ($subscriptions as $sub) {
            $subscription = Subscription::create([
                'endpoint' => $sub->endpoint,
                'publicKey' => $sub->public_key,
                'authToken' => $sub->auth_token,
                'contentEncoding' => $sub->content_encoding,
            ]);

            $webPush->sendOneNotification($subscription, $payload);
        }

        return response()->json(['sent' => true]);
    }
}
