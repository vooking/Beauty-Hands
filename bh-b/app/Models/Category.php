<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'type'
    ];

    public function portfolios()
    {
        return $this->hasMany(Portfolio::class);
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }
}
