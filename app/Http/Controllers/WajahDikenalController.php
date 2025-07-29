<?php

namespace App\Http\Controllers;

use App\Models\WajahDikenal;
use Illuminate\Http\Request;

class WajahDikenalController extends Controller
{
    public function index()
    {
        return response()->json(WajahDikenal::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'posisi' => 'required|string|max:255',
            'foto' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('foto')) {
            $foto = $request->file('foto');
            $namaFile = uniqid() . '.' . $foto->getClientOriginalExtension();
            $foto->move(public_path('wajah'), $namaFile);
            $validated['foto'] = $namaFile;
        }

        $wajah = WajahDikenal::create($validated);

        return response()->json($wajah, 201);
    }

    public function update(Request $request, $id)
    {
        $wajah = WajahDikenal::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'posisi' => 'required|string|max:255',
            'foto' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('foto')) {
            $foto = $request->file('foto');
            $namaFile = uniqid() . '.' . $foto->getClientOriginalExtension();
            $foto->move(public_path('wajah'), $namaFile);
            $validated['foto'] = $namaFile;
        }

        $wajah->update($validated);

        return response()->json($wajah);
    }

    public function destroy($id)
    {
        $wajah = WajahDikenal::findOrFail($id);
        $wajah->delete();

        return response()->json(null, 204);
    }
}
