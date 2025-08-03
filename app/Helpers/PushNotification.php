<?php

namespace App\Helpers;

use App\Models\User;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;
use Illuminate\Support\Facades\Log;

class PushNotification
{
    public static function send(string $title, string $body): void
    {
        $payload = json_encode([
            'title' => $title,
            'body'  => $body,
        ]);

        $auth = [
            'VAPID' => [
                'subject' => 'mailto:muhammad.ilham7217@gmail.com',
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
    }
}
