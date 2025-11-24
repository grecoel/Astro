<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="description" content="Astro - Platform e-commerce terpercaya dengan katalog produk terlengkap">
        <meta name="theme-color" content="#c3ff41">
        <title>Shop to the Sky.</title>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @viteReactRefresh
        
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    </head>
    <body class="font-sans antialiased">
        {{-- 
          "Kanvas" untuk Plain React Anda
        --}}
        <div id="app"></div>
    </body>
</html>