<?php
use app\Http\Controllers\Api\SellerController;
use Illuminate\Support\Facades\Route;


//Route srs01
Route::post('/sellers', [SellerController::class, 'store']);