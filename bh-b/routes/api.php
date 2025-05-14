<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ServiceController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\CategoryController;

use App\Http\Controllers\Admin\ServiceAdminController;
use App\Http\Controllers\Admin\FeedbackAdminController;
use App\Http\Controllers\Admin\PortfolioAdminController;
use App\Http\Controllers\Admin\CategoryAdminController;
use App\Http\Controllers\AuthController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/feedback', [FeedbackController::class, 'store']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/portfolio', [PortfolioController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

Route::middleware(['auth:sanctum', 'is_admin'])->prefix('admin')->group(function () {

    Route::apiResource('categories', CategoryAdminController::class);
    Route::get('/categories', [CategoryAdminController::class, 'index']);
    Route::post('/categories', [CategoryAdminController::class, 'store']);
    Route::put('/categories/{category}', [CategoryAdminController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryAdminController::class, 'destroy']);

    Route::get('/feedback', [FeedbackAdminController::class, 'index']);
    Route::delete('/feedback/{id}', [FeedbackAdminController::class, 'destroy']);

    Route::post('/services', [ServiceAdminController::class, 'store']);
    Route::put('/services/{service}', [ServiceAdminController::class, 'update']);
    Route::delete('/services/{service}', [ServiceAdminController::class, 'destroy']);

    Route::get('/portfolio', [PortfolioAdminController::class, 'index']);
    Route::post('/portfolio', [PortfolioAdminController::class, 'store']);
    Route::put('/portfolio/{portfolio}', [PortfolioAdminController::class, 'update']);
    Route::delete('/portfolio/{portfolio}', [PortfolioAdminController::class, 'destroy']);
});
