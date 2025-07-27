import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';

export default function Alarm() {
  const [alarmStatus, setAlarmStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState({ on: '', off: '' });
  const [espConnected, setEspConnected] = useState(false);
  const [isAlarmTriggered, setIsAlarmTriggered] = useState(false);

  // Ganti IP ini dengan alamat IP ESP32 kamu
  const ESP32_BASE_URL = 'http://192.168.191.1';

  // Cek koneksi dan status alarm secara berkala
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${ESP32_BASE_URL}/status`);
        setEspConnected(true);
        setAlarmStatus(res.data.alarm_active);
        setIsAlarmTriggered(res.data.alarm_triggered); // status dari ESP32 kalau alarm sedang berbunyi
      } catch (error) {
        setEspConnected(false);
        console.error('ESP32 tidak terhubung:', error.message);
      }
    }, 3000); // cek setiap 3 detik

    return () => clearInterval(interval);
  }, []);

  const toggleAlarm = async () => {
    setLoading(true);
    const newStatus = !alarmStatus;

    try {
      const endpoint = newStatus ? `${ESP32_BASE_URL}/alarm/on` : `${ESP32_BASE_URL}/alarm/off`;
      await axios.get(endpoint);
      setAlarmStatus(newStatus);
    } catch (error) {
      console.error('Gagal menghubungi ESP32:', error);
      alert('Gagal menghubungi ESP32. Pastikan ESP32 terhubung.');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleChange = (e) => {
    setSchedule({
      ...schedule,
      [e.target.name]: e.target.value,
    });
  };

  const submitSchedule = async (e) => {
    e.preventDefault();
    if (!schedule.on || !schedule.off) {
      alert('Silakan isi waktu aktif dan nonaktif alarm.');
      return;
    }

    try {
      await axios.post(`${ESP32_BASE_URL}/alarm/schedule`, {
        time_on: schedule.on,
        time_off: schedule.off,
      });

      alert('Jadwal berhasil dikirim ke ESP32!');
    } catch (error) {
      console.error('Gagal mengirim jadwal:', error);
      alert('Gagal menghubungi ESP32.');
    }
  };

  const stopAlarmSound = async () => {
    try {
      await axios.get(`${ESP32_BASE_URL}/alarm/stop-sound`);
      alert('Alarm berhasil dimatikan.');
    } catch (error) {
      console.error('Gagal mematikan alarm:', error);
      alert('Gagal menghubungi ESP32.');
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Kontrol & Jadwal Alarm (ESP32)</h1>

      {/* Status Koneksi */}
      <div className="mb-4 text-sm">
        Status Koneksi ESP32:{' '}
        <span className={`font-semibold ${espConnected ? 'text-green-600' : 'text-red-600'}`}>
          {espConnected ? 'Terhubung' : 'Tidak Terhubung'}
        </span>
      </div>

      {/* Kontrol Manual */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Kontrol Alarm Manual</h2>
        <button
          onClick={toggleAlarm}
          disabled={loading || !espConnected}
          className={`px-4 py-2 rounded-md text-white font-medium transition ${
            alarmStatus ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
          } ${loading || !espConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Memproses...' : alarmStatus ? 'Matikan Alarm' : 'Aktifkan Alarm'}
        </button>
      </div>

      {/* Matikan Alarm Jika Bunyi */}
      {isAlarmTriggered && (
        <div className="bg-red-100 text-red-700 border border-red-300 rounded-md p-4 mb-6">
          <p className="font-semibold mb-2">Alarm sedang berbunyi!</p>
          <button
            onClick={stopAlarmSound}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Matikan Suara Alarm
          </button>
        </div>
      )}

      {/* Jadwal Alarm */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Jadwal Alarm Otomatis</h2>
        <form onSubmit={submitSchedule} className="space-y-4">
          <div>
            <label htmlFor="on" className="block text-sm font-medium text-gray-700">
              Waktu Aktif
            </label>
            <input
              type="time"
              name="on"
              id="on"
              value={schedule.on}
              onChange={handleScheduleChange}
              className="mt-1 block w-48 px-3 py-2 border rounded-md shadow-sm focus:ring focus:border-blue-300"
              required
            />
          </div>

          <div>
            <label htmlFor="off" className="block text-sm font-medium text-gray-700">
              Waktu Nonaktif
            </label>
            <input
              type="time"
              name="off"
              id="off"
              value={schedule.off}
              onChange={handleScheduleChange}
              className="mt-1 block w-48 px-3 py-2 border rounded-md shadow-sm focus:ring focus:border-blue-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!espConnected}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Kirim Jadwal ke ESP32
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
