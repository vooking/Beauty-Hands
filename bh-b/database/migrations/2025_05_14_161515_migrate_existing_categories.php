<?php

use App\Models\Category;
use App\Models\Portfolio;
use App\Models\Service;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        $categories = [
            'Наращивание ногтей',
            'Маникюр',
            'Педикюр',
            'Брови и ресницы',
            'Лицо',
            'Массаж',
            'Препаратный педикюр KART',
            'Комплексы',
            'Пирсинг',
            'Депиляция',
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category,
                'slug' => \Str::slug($category),
                'type' => 'both',
            ]);
        }

        // Обновляем портфолио и услуги
        foreach (Portfolio::all() as $portfolio) {
            $category = Category::where('name', $portfolio->category)->first();
            if ($category) {
                $portfolio->category_id = $category->id;
                $portfolio->save();
            }
        }

        foreach (Service::all() as $service) {
            $category = Category::where('name', $service->category)->first();
            if ($category) {
                $service->category_id = $category->id;
                $service->save();
            }
        }
    }
};
