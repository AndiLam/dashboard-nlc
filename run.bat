@echo off
title Jalankan Face Recognition + Upload HLS

REM Jalankan face_recog/app.py
start "Face Recognition" cmd /k python face_recog\app.py

REM Jalankan uploader/upload_hls.py
start "Upload HLS" cmd /k python uploader\upload_hls.py

echo Semua proses telah dijalankan.
pause
