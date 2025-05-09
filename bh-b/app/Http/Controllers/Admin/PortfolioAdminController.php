<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Portfolio;

class PortfolioAdminController extends Controller
{
    // Добавить запись в портфолио
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'image_url' => 'required|string|max:255', // URL или путь до картинки
            'category' => 'nullable|string|max:100',
        ]);

        $portfolio = Portfolio::create($validated);

        return response()->json($portfolio, 201);
    }

    // Обновить запись
    public function update(Request $request, Portfolio $portfolio)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'image_url' => 'sometimes|required|string|max:255',
            'category' => 'nullable|string|max:100',
        ]);

        $portfolio->update($validated);

        return response()->json($portfolio);
    }

    // Удалить запись
    public function destroy(Portfolio $portfolio)
    {
        $portfolio->delete();

        return response()->json(['message' => 'Элемент портфолио удалён']);
    }
}
