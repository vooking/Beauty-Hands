<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Category;

class ServiceController extends Controller
{
    public function index()
    {
        return response()->json(Service::with('category')->get());
    }
}
