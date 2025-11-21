<?php

use Illuminate\Support\Facades\Route;

// Catch-all route untuk React SPA
// Semua route akan diarahkan ke app.blade.php
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
