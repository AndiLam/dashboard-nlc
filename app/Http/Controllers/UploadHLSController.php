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

        // path ke folder public_html/stream (satu level di atas public)
        $destinationPath = public_path('../stream');

        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }

        $file->move($destinationPath, $filename);

        return response()->json([
            'message' => 'File berhasil diupload ke public_html/stream',
            'path' => 'stream/' . $filename,
        ]);
    }
}
