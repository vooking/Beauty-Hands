<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
    protected $fillable = [
        'title',
        'image_url',
        'category_id',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
