<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('category');
            $table->string('name');
            $table->json('prices');
            $table->timestamps();
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
