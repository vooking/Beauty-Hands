<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ServiceController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\PortfolioController;

use App\Http\Controllers\Admin\ServiceAdminController;
use App\Http\Controllers\Admin\FeedbackAdminController;
use App\Http\Controllers\Admin\PortfolioAdminController;
use App\Http\Controllers\AuthController;

/* Публичные маршруты */

// Получить текущего пользователя (если авторизован)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Обратная связь (форма на сайте)
Route::post('/feedback', [FeedbackController::class, 'store']);

// Список услуг (для сайта)
Route::get('/services', [ServiceController::class, 'index']);

// Список работ (портфолио)
Route::get('/portfolio', [PortfolioController::class, 'index']);

/* Админские маршруты */

// Логин и логаут для админа
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

// Группа защищённых админских маршрутов
Route::middleware(['auth:sanctum', 'is_admin'])->prefix('admin')->group(function () {

    // Обратная связь — список, удаление
    Route::get('/feedback', [FeedbackAdminController::class, 'index']);
    Route::delete('/feedback/{id}', [FeedbackAdminController::class, 'destroy']);

    // Услуги — создание, редактирование, удаление
    Route::post('/services', [ServiceAdminController::class, 'store']);
    Route::put('/services/{service}', [ServiceAdminController::class, 'update']);
    Route::delete('/services/{service}', [ServiceAdminController::class, 'destroy']);

    // Портфолио — загрузка, редактирование, удаление
    Route::get('/portfolio', [PortfolioAdminController::class, 'index']);
    Route::post('/portfolio', [PortfolioAdminController::class, 'store']);
    Route::put('/portfolio/{portfolio}', [PortfolioAdminController::class, 'update']);
    Route::delete('/portfolio/{portfolio}', [PortfolioAdminController::class, 'destroy']);
});
