<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'prices',
    ];

    protected $casts = [
        'prices' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
