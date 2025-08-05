import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';

export default function Alarm() {
  const [alarmStatus, setAlarmStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState({ on: '', off: '' });
  const [espConnected, setEspConnected] = useState(false);
  const [isAlarmTriggered, setIsAlarmTriggered] = useState(false);
  const [jadwalLog, setJadwalLog] = useState([]);
  const [triggerLog, setTriggerLog] = useState([]);
  const [statusLoading, setStatusLoading] = useState(false);

  const ESP32_BASE_URL = '/api/esp32';

  useEffect(() => {
    axios.get('/sanctum/csrf-cookie');
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const [jadwal, trigger] = await Promise.all([
        axios.get('/api/jadwal-log'),
        axios.get('/api/alarm-trigger-log'),
      ]);
      setJadwalLog(jadwal.data);
      setTriggerLog(trigger.data);
    } catch (error) {
      console.error('Gagal memuat log:', error);
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      setStatusLoading(true);
      try {
        const res = await axios.get(`${ESP32_BASE_URL}/status`);
        setEspConnected(true);
        setAlarmStatus(res.data.alarm_active);
        setIsAlarmTriggered(res.data.alarm_triggered);
      } catch {
        setEspConnected(false);
      } finally {
        setStatusLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleAlarm = async () => {
    setLoading(true);
    try {
      const endpoint = alarmStatus ? 'off' : 'on';
      await axios.get(`${ESP32_BASE_URL}/alarm/${endpoint}`);
      setAlarmStatus(!alarmStatus);
    } catch {
      alert('Gagal menghubungi ESP32.');
    } finally {
      setLoading(false);
    }
  };

  const stopAlarmSound = async () => {
    try {
      await axios.get(`${ESP32_BASE_URL}/alarm/stop-sound`);
      alert('Suara alarm dimatikan.');
      fetchLogs();
    } catch {
      alert('Gagal mematikan alarm.');
    }
  };

  const handleScheduleChange = (e) => {
    setSchedule({ ...schedule, [e.target.name]: e.target.value });
  };

  const submitSchedule = async (e) => {
    e.preventDefault();
    if (!schedule.on || !schedule.off) return alert('Lengkapi waktu alarm.');

    try {
      await axios.post(`${ESP32_BASE_URL}/alarm/schedule`, {
        time_on: schedule.on,
        time_off: schedule.off,
      });
      alert('Jadwal dikirim!');
      fetchLogs();
    } catch {
      alert('Gagal mengirim jadwal ke ESP32.');
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Kontrol & Jadwal Alarm</h1>

      {/* Status Panel */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-3">Status Sistem</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Koneksi ESP32:</span>{' '}
              <span className={`font-semibold ${espConnected ? 'text-green-600' : 'text-red-600'}`}>
                {espConnected ? 'Terhubung' : 'Tidak Terhubung'}
              </span>
              {statusLoading && <span className="text-xs text-gray-400 ml-2">(memuat...)</span>}
            </div>
            <div>
              <span className="font-medium">Status Alarm:</span>{' '}
              <span className={`font-semibold ${alarmStatus ? 'text-red-600' : 'text-gray-500'}`}>
                {alarmStatus ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
            <div>
              <span className="font-medium">Alarm Berbunyi:</span>{' '}
              <span className={`font-semibold ${isAlarmTriggered ? 'text-red-600' : 'text-gray-500'}`}>
                {isAlarmTriggered ? 'Ya' : 'Tidak'}
              </span>
            </div>
          </div>

          {isAlarmTriggered && (
            <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md">
              <p className="mb-2 font-semibold text-red-700">Alarm sedang berbunyi!</p>
              <button
                onClick={stopAlarmSound}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Matikan Suara Alarm
              </button>
            </div>
          )}
        </div>

        {/* Manual Control Panel */}
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-3">Kontrol Manual</h2>
          <button
            onClick={toggleAlarm}
            disabled={loading || !espConnected}
            className={`w-full py-2 rounded text-white font-semibold transition 
              ${alarmStatus ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} 
              ${loading || !espConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Memproses...' : alarmStatus ? 'Matikan Alarm' : 'Aktifkan Alarm'}
          </button>
        </div>
      </div>

      {/* Schedule Panel */}
      <div className="mt-6 bg-white shadow rounded-lg p-5 max-w-xl">
        <h2 className="text-lg font-semibold mb-4">Jadwal Alarm Otomatis</h2>
        <form onSubmit={submitSchedule} className="space-y-4">
          <div>
            <label htmlFor="on" className="block text-sm font-medium">Waktu Aktif</label>
            <input
              type="time"
              name="on"
              id="on"
              value={schedule.on}
              onChange={handleScheduleChange}
              className="mt-1 w-48 px-3 py-2 border rounded shadow-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="off" className="block text-sm font-medium">Waktu Nonaktif</label>
            <input
              type="time"
              name="off"
              id="off"
              value={schedule.off}
              onChange={handleScheduleChange}
              className="mt-1 w-48 px-3 py-2 border rounded shadow-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={!espConnected}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Kirim Jadwal ke ESP32
          </button>
        </form>
      </div>

      {/* Logs */}
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Log Jadwal Alarm</h2>
          <ul className="text-sm space-y-2">
            {jadwalLog.length > 0 ? jadwalLog.map((item, i) => (
              <li key={i} className="flex justify-between border-b pb-1">
                <span>Aktif: {item.waktu_on} - Nonaktif: {item.waktu_off} ({item.duration ?? 0} detik)</span>
                <span className="text-gray-500">{new Date(item.created_at).toLocaleString()}</span>
              </li>
            )) : <p className="text-gray-500">Belum ada log jadwal.</p>}
          </ul>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Riwayat Alarm Menyala</h2>
          <ul className="text-sm space-y-2">
            {triggerLog.length > 0 ? triggerLog.map((item, i) => (
              <li key={i} className="flex justify-between border-b pb-1">
                <span>{item.sumber_trigger ?? 'Sistem'}: Alarm Aktif</span>
                <span className="text-gray-500">{new Date(item.created_at).toLocaleString()}</span>
              </li>
            )) : <p className="text-gray-500">Belum ada alarm yang menyala.</p>}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
