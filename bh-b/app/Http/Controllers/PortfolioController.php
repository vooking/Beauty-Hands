<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PortfolioController extends Controller
{
    public function index(Request $request)
    {
        $query = Portfolio::with('category');

        if ($request->has('category')) {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        $portfolios = $query->orderByDesc('created_at')->get();

        $portfolios->transform(function ($item) {
            $item->url = Storage::disk('public')->url($item->image_url);
            return $item;
        });

        return response()->json($portfolios);
    }
}
