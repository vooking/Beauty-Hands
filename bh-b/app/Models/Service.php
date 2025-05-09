<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'category',
        'name',
        'prices',
    ];

    protected $casts = [
        'prices' => 'array',
    ];
}
