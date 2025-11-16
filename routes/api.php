<?php
use app\Http\Controllers\Api\SellerController;



//Route srs01
Route::post('/sellers', [SellerController::class, 'store']);