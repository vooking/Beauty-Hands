<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\Category;

class ServiceAdminController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'prices' => 'required|json',
        ]);

        $service = Service::create($validated);
        return response()->json($service->load('category'), 201);
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'category_id' => 'sometimes|required|exists:categories,id',
            'name' => 'sometimes|required|string|max:255',
            'prices' => 'sometimes|required|json',
        ]);

        $service->update($validated);
        return response()->json($service->load('category'));
    }

    public function destroy(Service $service)
    {
        $service->delete();
        return response()->json(['message' => 'Услуга успешно удалена']);
    }
}
