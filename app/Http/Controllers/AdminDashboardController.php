<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Admin/Dashboard');
    }

    public function streaming()
    {
        return Inertia::render('Admin/Streaming');
    }

    public function log()
    {
        return Inertia::render('Admin/LogDeteksi');
    }

    public function wajah()
    {
        return Inertia::render('Admin/DaftarWajah');
    }

    public function notifikasi()
    {
        return Inertia::render('Admin/Notifikasi');
    }
}
