<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class Esp32TriggerController extends Controller
{
    protected $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('app.local_esp32_url');
    }

    public function turnOn()
    {
        try {
            return Http::timeout(2)->get($this->baseUrl . '/alarm/on');
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal menghidupkan alarm'], 500);
        }
    }

    public function turnOff()
    {
        try {
            return Http::timeout(2)->get($this->baseUrl . '/alarm/off');
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal mematikan alarm'], 500);
        }
    }
}
