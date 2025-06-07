<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Feedback;
use ReCaptcha\ReCaptcha;

class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'message' => 'nullable|string',
            'g-recaptcha-response' => 'required|string',
        ]);

        // Валидация reCAPTCHA
if (app()->environment('production')) {
    $recaptcha = new ReCaptcha(env('RECAPTCHA_SECRET_KEY'));
    $response = $recaptcha->verify($request->input('g-recaptcha-response'), $request->ip());

    if (!$response->isSuccess()) {
        return response()->json([
            'errors' => ['captcha' => ['Не пройдена проверка reCAPTCHA']]
        ], 422);
    }
}


        Feedback::create($validated);

        return response()->json(['message' => 'Спасибо! Мы с вами свяжемся.']);
    }
}