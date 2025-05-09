<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service;

class ServiceAdminController extends Controller
{
    // Создание новой услуги
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:100',
            'name' => 'required|string|max:255',
            'prices' => 'required|json',
        ]);

        $service = Service::create($validated);
        return response()->json($service, 201);
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'category' => 'sometimes|required|string|max:100',
            'name' => 'sometimes|required|string|max:255',
            'prices' => 'sometimes|required|json',
        ]);

        $service->update($validated);
        return response()->json($service);
    }


    // Удаление услуги
    public function destroy(Service $service)
    {
        $service->delete();

        return response()->json(['message' => 'Услуга успешно удалена']);
    }
}
