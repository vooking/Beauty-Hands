<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Portfolio;
use Illuminate\Support\Facades\Storage;

class PortfolioAdminController extends Controller
{
    public function index(Request $request)
    {
        $query = Portfolio::query();

        if ($request->has('category')) {
            $query->where('category', $request->category);
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
            'category' => 'nullable|string|max:100',
        ]);

        $path = $request->file('image')->store('portfolio', 'public');

        $portfolio = Portfolio::create([
            'title' => $validated['title'] ?? null,
            'image_url' => $path,
            'category' => $validated['category'] ?? null,
        ]);

        return response()->json($portfolio, 201);
    }

    public function update(Request $request, Portfolio $portfolio)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'sometimes|image|max:2048',
            'category' => 'nullable|string|max:100',
        ]);

        if ($request->hasFile('image')) {
            if ($portfolio->image_url) {
                Storage::disk('public')->delete($portfolio->image_url);
            }
            $path = $request->file('image')->store('portfolio', 'public');
            $portfolio->image_url = $path;
        }

        $portfolio->title = $validated['title'] ?? $portfolio->title;
        $portfolio->category = $validated['category'] ?? $portfolio->category;
        $portfolio->save();

        return response()->json($portfolio);
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
