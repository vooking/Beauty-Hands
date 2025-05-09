<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PortfolioController extends Controller
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
}
