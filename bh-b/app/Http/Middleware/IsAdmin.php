<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !$request->user()->is_admin) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}

// php artisan tinker

// $user = new \App\Models\User;
// $user->name = 'Admin';
// $user->email = 'admin@example.com';
// $user->password = bcrypt('admin123');
// $user->is_admin = true;
// $user->save();

// логин: admin@example.com
// пароль: admin123
