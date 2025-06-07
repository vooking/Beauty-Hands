<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    // Логин
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('YourAppName')->plainTextToken;
            return response()->json(['token' => $token, 'user' => $user]);
        }

        return response()->json(['message' => 'Неверный логин или пароль'], 401);
    }

    // Логаут
    public function logout(Request $request)
    {
        Auth::logout();
        return response()->json(['message' => 'Вы успешно вышли.']);
    }

    // Получение текущего пользователя
    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
