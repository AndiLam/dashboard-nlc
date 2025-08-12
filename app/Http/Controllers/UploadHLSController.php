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
        // Ambil semua file .ts
        $files = File::files($this->streamFolder);

        // Filter hanya file .ts
        $segments = array_filter($files, function ($file) {
            return preg_match('/\.ts$/', $file->getFilename());
        });

        // Urutkan berdasarkan nama (segment_001.ts, segment_002.ts, dst)
        usort($segments, function ($a, $b) {
            return strcmp($a->getFilename(), $b->getFilename());
        });

        // Tentukan jumlah segmen yang mau disisakan
        $keepCount = 5;
        $totalSegments = count($segments);

        // Jika jumlah segmen melebihi batas, hapus yang lama
        if ($totalSegments > $keepCount) {
            $segmentsToDelete = array_slice($segments, 0, $totalSegments - $keepCount);

            foreach ($segmentsToDelete as $file) {
                // Pastikan bukan file yang baru saja diupload
                if ($file->getFilename() !== $latestFilename) {
                    File::delete($file->getRealPath());
                }
            }
        }
    }
}
