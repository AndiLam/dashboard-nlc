<?php

namespace App\Services;

use PhpMqtt\Client\MqttClient;
use PhpMqtt\Client\ConnectionSettings;
use PhpMqtt\Client\Exceptions\MqttClientException;
use Illuminate\Support\Facades\Log;

class MqttService
{
    protected $server = '393f23b123494ba7993b86b9cfc4ae97.s1.eu.hivemq.cloud';
    protected $port = 8883;
    protected $username = 'NLCFarm_Alarm';
    protected $password = 'MariAman24!';

    public function publishControlMessage(string $message)
    {
        $clientId = 'laravel-backend-client-' . uniqid();
        $topic = 'focfarm/alarm/control';

        try {
            $mqtt = new MqttClient($this->server, $this->port, $clientId);

            $connectionSettings = (new ConnectionSettings)
                ->setUsername($this->username)
                ->setPassword($this->password)
                ->setUseTls(true);

            $mqtt->connect($connectionSettings, true);
            $mqtt->publish($topic, $message, 0);
            $mqtt->disconnect();
        } catch (MqttClientException $e) {
            Log::error('MQTT publish error: ' . $e->getMessage());
        }
    }
}
