<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\GuestbookController;
use Illuminate\Support\Facades\Route;

Route::get('/api/guestbook', [GuestbookController::class, 'index']);
Route::post('/api/guestbook', [GuestbookController::class, 'store'])->middleware('throttle:6,1');
Route::delete('/api/guestbook/{id}', [GuestbookController::class, 'destroy'])->middleware('throttle:12,1');
Route::post('/api/contact', ContactController::class)->middleware('throttle:3,1');
Route::view('/', 'portfolio');
Route::get('/projects/{slug}', function (string $slug) {
    return response()->view('portfolio', [], in_array($slug, ['pyrorescue', 'siagagambut', 'sipkos'], true) ? 200 : 404);
});
Route::fallback(fn () => response()->view('portfolio', [], 404));
