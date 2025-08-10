<?php

namespace App\Services;

use PhpMqtt\Client\MqttClient;
use PhpMqtt\Client\ConnectionSettings;
use PhpMqtt\Client\Exceptions\MqttClientException;
use Illuminate\Support\Facades\Log;

class MqttService
{
    protected $server;
    protected $port;
    protected $username;
    protected $password;
    protected $useTls;
    protected $topic;

    public function __construct()
    {
        $this->server = config('mqtt.server');
        $this->port = config('mqtt.port');
        $this->username = config('mqtt.username');
        $this->password = config('mqtt.password');
        $this->useTls = config('mqtt.use_tls');
        $this->topic = config('mqtt.topic_control');
    }

    public function publishControlMessage(string $message)
    {
        $clientId = 'laravel-backend-client-' . uniqid();

        try {
            $mqtt = new MqttClient($this->server, $this->port, $clientId);

            $connectionSettings = (new ConnectionSettings)
                ->setUsername($this->username)
                ->setPassword($this->password)
                ->setUseTls($this->useTls);

            $mqtt->connect($connectionSettings, true);
            Log::info("MQTT connected to {$this->server}:{$this->port}");

            $mqtt->publish($this->topic, $message, 0);
            Log::info("MQTT message published to topic {$this->topic}: {$message}");

            $mqtt->disconnect();
            Log::info("MQTT disconnected");
        } catch (MqttClientException $e) {
            Log::error('MQTT publish error: ' . $e->getMessage());
            throw $e;
        }
    }
}
