<?php

return [
    'hot_file' => public_path('hot'),

    'build_directory' => 'build',

    'manifest_path' => public_path('build/manifest.json'),

    'asset_url' => env('ASSET_URL', null),

    'ssr_manifest_path' => storage_path('app/ssr/manifest.json'),
];
