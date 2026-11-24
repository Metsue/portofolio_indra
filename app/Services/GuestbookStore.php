<?php

namespace App\Services;

use RuntimeException;

class GuestbookStore
{
    /** Serialize concurrent updates; data remains outside public/. */
    public function transaction(callable $callback): mixed
    {
        $path = config('portfolio.guestbook_path');
        if (! is_dir(dirname($path))) {
            mkdir(dirname($path), 0755, true);
        }
        $handle = fopen($path, 'c+');
        if (! $handle || ! flock($handle, LOCK_EX)) {
            throw new RuntimeException('Penyimpanan guestbook tidak tersedia.');
        }
        try {
            $raw = stream_get_contents($handle);
            $rows = $raw === '' ? [] : json_decode($raw, true, flags: JSON_THROW_ON_ERROR);
            $before = $rows;
            $result = $callback($rows);
            if ($before !== $rows) {
                $json = json_encode(array_values($rows), JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
                rewind($handle);
                if (fwrite($handle, $json) !== strlen($json)) {
                    throw new RuntimeException('Komentar belum tersimpan.');
                }
                ftruncate($handle, strlen($json));
                fflush($handle);
            }

            return $result;
        } finally {
            flock($handle, LOCK_UN);
            fclose($handle);
        }
    }
}
