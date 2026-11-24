<?php

namespace App\Http\Controllers;

use App\Services\GuestbookStore;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GuestbookController extends Controller
{
    private function owner(Request $request): string
    {
        if (! $request->session()->has('guestbook_owner')) {
            $request->session()->put('guestbook_owner', Str::random(40));
        }

        return $request->session()->get('guestbook_owner');
    }

    public function index(Request $request, GuestbookStore $store): JsonResponse
    {
        $owner = $this->owner($request);

        return response()->json($store->transaction(fn (array &$rows) => array_map(fn ($row) => [
            'id' => $row['id'], 'name' => $row['name'], 'text' => $row['text'],
            'date' => $row['date'], 'canDelete' => hash_equals($row['owner'], $owner),
        ], array_slice($rows, 0, 100))))->header('Cache-Control', 'no-store');
    }

    public function store(Request $request, GuestbookStore $store): JsonResponse
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:50'], 'text' => ['required', 'string', 'max:1000'], 'website' => ['nullable', 'max:0']]);
        $row = ['id' => (string) Str::uuid(), 'name' => $data['name'], 'text' => $data['text'], 'date' => now()->toIso8601String(), 'owner' => $this->owner($request)];
        $store->transaction(function (array &$rows) use ($row) {
            array_unshift($rows, $row);
            $rows = array_slice($rows, 0, 100);
        });
        unset($row['owner']);

        return response()->json([...$row, 'canDelete' => true], 201);
    }

    public function destroy(Request $request, string $id, GuestbookStore $store): JsonResponse
    {
        $owner = $this->owner($request);
        $store->transaction(function (array &$rows) use ($id, $owner) {
            $index = array_search($id, array_column($rows, 'id'), true);
            abort_if($index === false, 404);
            abort_unless(hash_equals($rows[$index]['owner'], $owner), 403);
            array_splice($rows, $index, 1);
        });

        return response()->json(['deleted' => true]);
    }
}
