<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <link rel="icon" href="{{ asset('assets/logo.ico') }}" type="image/x-icon">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link rel="manifest" href="/manifest.webmanifest">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @php
        $componentPath = 'resources/js/Pages/' . str_replace('.', '/', $page['component']) . '.jsx';
    @endphp
    
    @vite([
        'resources/js/app.jsx',
        $componentPath
    ])
    @inertiaHead
</head>
<body class="font-sans antialiased">
    @inertia
</body>
</html>
