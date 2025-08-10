import { useEffect, useState, useRef } from 'react';
import mqtt from 'mqtt';

export default function useMqtt() {
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const clientRef = useRef(null);

  useEffect(() => {
    // Konfigurasi HiveMQ Cloud
    const options = {
      protocol: 'wss', // WebSocket TLS
      username: 'NLCFarm_Alarm',
      password: 'MariAman24!',
      reconnectPeriod: 4000,
      clientId: 'web-client-' + Math.random().toString(16).substr(2, 8),
      clean: true,
    };

    // URL broker WebSocket HiveMQ Cloud: format wss://host:port/mqtt
    // Port 8883 biasanya TCP TLS, WebSocket port biasanya 8884 (cek di HiveMQ Cloud dashboard)
    // HiveMQ Cloud default WebSocket port: 8884 (bisa dicek)
    // Jadi, kita ganti ke 8884 dan gunakan wss://
    const host = 'wss://393f23b123494ba7993b86b9cfc4ae97.s1.eu.hivemq.cloud:8884/mqtt';

    const mqttClient = mqtt.connect(host, options);

    clientRef.current = mqttClient;
    setClient(mqttClient);

    mqttClient.on('connect', () => {
      setIsConnected(true);
      console.log('MQTT connected');
      // Subscribe ke topic status
      mqttClient.subscribe('focfarm/alarm/status', (err) => {
        if (err) console.error('Subscribe error', err);
      });
    });

    mqttClient.on('reconnect', () => {
      setIsConnected(false);
      console.log('Reconnecting MQTT...');
    });

    mqttClient.on('error', (err) => {
      console.error('Connection error: ', err);
      mqttClient.end();
    });

    mqttClient.on('message', (topic, message) => {
      if (topic === 'focfarm/alarm/status') {
        try {
          const msg = JSON.parse(message.toString());
          setMessages((prev) => [...prev.slice(-9), msg]); // simpan max 10 pesan terakhir
        } catch (e) {
          console.error('Invalid JSON message', e);
        }
      }
    });

    return () => {
      mqttClient.end(true);
    };
  }, []);

  // Fungsi publish control message (on/off/stop-sound)
  const publishControl = (action) => {
    if (clientRef.current && isConnected) {
      const payload = JSON.stringify({ action });
      clientRef.current.publish('focfarm/alarm/control', payload, { qos: 0 }, (err) => {
        if (err) console.error('Publish error:', err);
      });
    } else {
      console.warn('MQTT client not connected');
    }
  };

  return { isConnected, messages, publishControl };
}
