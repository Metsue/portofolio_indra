<?php

return [
    'email' => env('CONTACT_EMAIL', 'mhmmadindrra@gmail.com'),
    'mail_enabled' => (bool) env('CONTACT_MAIL_ENABLED', false),
    'guestbook_path' => storage_path('app/private/guestbook.json'),
];
