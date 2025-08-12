<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class UploadHLSController extends Controller
{
    // Folder tempat simpan segment di server hosting
    private $streamFolder;

    public function __construct()
    {
        $this->streamFolder = public_path('../stream');
        if (!file_exists($this->streamFolder)) {
            mkdir($this->streamFolder, 0755, true);
        }
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file',
            'filename' => 'required|string',
        ]);

        $file = $request->file('file');
        $filename = $request->input('filename');

        // Simpan file upload
        $file->move($this->streamFolder, $filename);

        // Hapus segment lama (kecuali playlist dan segment terbaru)
        $this->cleanupOldSegments($filename);

        return response()->json([
            'message' => 'File berhasil diupload ke public_html/stream',
            'path' => 'stream/' . $filename,
        ]);
    }

    private function cleanupOldSegments($latestFilename)
    {
        // Hanya hapus file .ts kecuali file yang baru saja diupload
        $files = File::files($this->streamFolder);

        foreach ($files as $file) {
            $name = $file->getFilename();

            // Jangan hapus playlist dan file terbaru yang sedang diupload
            if ($name === 'playlist.m3u8' || $name === $latestFilename) {
                continue;
            }

            // Hapus file segment .ts lama
            if (preg_match('/\.ts$/', $name)) {
                // Bisa juga pakai pengecekan timestamp jika mau lebih spesifik
                File::delete($file->getRealPath());
            }
        }
    }
}
