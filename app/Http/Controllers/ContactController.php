<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $data = $request->validate(['name' => 'required|string|max:80', 'email' => 'required|email|max:160', 'message' => 'required|string|min:5|max:3000']);
        if (! config('portfolio.mail_enabled') || in_array(config('mail.default'), ['log', 'array'], true)) {
            return response()->json(['message' => 'Kirim melalui aplikasi email Anda.', 'mode' => 'mailto', 'email' => config('portfolio.email')], 409);
        }
        Mail::raw($data['message'], function ($mail) use ($data) {
            $mail->to(config('portfolio.email'))->replyTo($data['email'], $data['name'])->subject('Pesan portofolio dari '.$data['name']);
        });

        return response()->json(['message' => 'Pesan diterima oleh layanan email.']);
    }
}
