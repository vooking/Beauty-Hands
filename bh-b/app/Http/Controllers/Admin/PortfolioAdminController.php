<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Portfolio;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;

class PortfolioAdminController extends Controller
{
    public function index(Request $request)
    {
        $query = Portfolio::with('category');

        if ($request->has('category')) {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('id', $request->category);
            });
        }

        $portfolios = $query->orderByDesc('created_at')->get();

        $portfolios->transform(function ($item) {
            $item->url = Storage::disk('public')->url($item->image_url);
            return $item;
        });

        return response()->json($portfolios);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'required|image|max:2048',
            'category_id' => 'required|exists:categories,id',
        ]);

        $path = $request->file('image')->store('portfolio', 'public');

        $portfolio = Portfolio::create([
            'title' => $validated['title'] ?? null,
            'image_url' => $path,
            'category_id' => $validated['category_id'],
        ]);

        return response()->json($portfolio->load('category'), 201);
    }

    public function update(Request $request, Portfolio $portfolio)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'sometimes|image|max:2048',
            'category_id' => 'sometimes|exists:categories,id',
        ]);

        if ($request->hasFile('image')) {
            if ($portfolio->image_url) {
                Storage::disk('public')->delete($portfolio->image_url);
            }
            $path = $request->file('image')->store('portfolio', 'public');
            $portfolio->image_url = $path;
        }

        $portfolio->title = $validated['title'] ?? $portfolio->title;
        if (isset($validated['category_id'])) {
            $portfolio->category_id = $validated['category_id'];
        }
        $portfolio->save();

        return response()->json($portfolio->load('category'));
    }

    public function destroy(Portfolio $portfolio)
    {
        if ($portfolio->image_url) {
            Storage::disk('public')->delete($portfolio->image_url);
        }

        $portfolio->delete();

        return response()->json(['message' => 'Элемент портфолио удалён']);
    }
}
