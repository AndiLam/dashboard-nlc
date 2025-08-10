<?php

return [
    'server' => env('MQTT_SERVER', '393f23b123494ba7993b86b9cfc4ae97.s1.eu.hivemq.cloud'),
    'port' => env('MQTT_PORT', 8884),
    'username' => env('MQTT_USERNAME', 'NLCFarm_Alarm'),
    'password' => env('MQTT_PASSWORD', 'MariAman24!'),
    'use_tls' => env('MQTT_USE_TLS', true),
    'topic_control' => env('MQTT_TOPIC_CONTROL', 'focfarm/alarm/control'),
];
