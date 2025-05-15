<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    protected $signature = 'make:admin';
    protected $description = 'Создаёт администратора';

    public function handle()
    {
        $name = $this->ask('Имя администратора');
        $email = $this->ask('Email администратора');
        $password = $this->secret('Пароль администратора');

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make($password),
                'is_admin' => true,
            ]
        );

        $this->info("Администратор {$user->email} успешно создан.");
    }
}
