<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryAdminController extends Controller
{
    public function index()
    {
        return response()->json(Category::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'type' => 'required|in:portfolio,service,both',
        ]);

        $validated['slug'] = \Str::slug($validated['name']);

        $category = Category::create($validated);

        return response()->json($category, 201);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:categories,name,'.$category->id,
            'type' => 'sometimes|required|in:portfolio,service,both',
        ]);

        if ($request->has('name')) {
            $validated['slug'] = \Str::slug($validated['name']);
        }

        $category->update($validated);

        return response()->json($category);
    }

    public function destroy(Category $category)
    {
        try {
            // Проверяем, используется ли категория
            if ($category->services()->exists() || $category->portfolios()->exists()) {
                return response()->json([
                    'message' => 'Категория используется и не может быть удалена'
                ], 422);
            }

            $category->delete();

            return response()->json(['message' => 'Категория успешно удалена']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ошибка при удалении категории: ' . $e->getMessage()
            ], 500);
        }
    }
}
