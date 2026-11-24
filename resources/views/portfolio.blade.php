<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#080611">
    <meta name="description" content="Muhammad Indra — pengembangan web, desain antarmuka, jaringan komputer, dan pengalaman digital interaktif. Jelajahi karya dan perjalanan saya.">
    <meta property="og:title" content="Muhammad Indra — Portfolio">
    <meta property="og:description" content="Ideas into experiences. Karya, sertifikasi, dan cerita di balik kode.">
    <link rel="icon" href="{{ asset('favicon.svg') }}" type="image/svg+xml">
    <title>Muhammad Indra — Portfolio</title>
    <script>window.__PORTFOLIO__ = {{ Illuminate\Support\Js::from(['baseUrl' => url('/'), 'csrf' => csrf_token(), 'email' => config('portfolio.email'), 'mailEnabled' => config('portfolio.mail_enabled') && !in_array(config('mail.default'), ['log', 'array'], true)]) }};</script>
    @viteReactRefresh
    @vite('src/main.tsx')
</head>
<body><div id="root"></div><noscript>Aktifkan JavaScript untuk menikmati portofolio interaktif Muhammad Indra. Email: {{ config('portfolio.email') }}</noscript></body>
</html>
