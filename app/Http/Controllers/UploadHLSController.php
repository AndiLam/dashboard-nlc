<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadHLSController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file',
            'filename' => 'required|string',
        ]);

        $file = $request->file('file');
        $filename = $request->input('filename');

        // Simpan file ke storage/public/stream
        $path = $file->storeAs('public/stream', $filename);

        return response()->json([
            'message' => 'File berhasil diupload',
            'path' => $path,
        ]);
    }
}
