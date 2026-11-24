<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class PortfolioTest extends TestCase
{
    private string $guestbookPath;

    protected function setUp(): void
    {
        parent::setUp();
        $this->guestbookPath = storage_path('framework/testing/guestbook-'.bin2hex(random_bytes(8)).'.json');
        config(['portfolio.guestbook_path' => $this->guestbookPath]);
    }

    protected function tearDown(): void
    {
        if (is_file($this->guestbookPath)) {
            unlink($this->guestbookPath);
        }
        parent::tearDown();
    }

    public function test_comments_persist_and_only_the_owning_session_can_delete(): void
    {
        $this->withSession(['guestbook_owner' => 'alice']);
        $comment = $this->postJson('/api/guestbook', ['name' => 'Alice', 'text' => 'Website menarik.', 'website' => ''])->assertCreated()->assertJsonPath('canDelete', true)->json();
        $this->assertFileExists($this->guestbookPath);
        $this->getJson('/api/guestbook')->assertOk()->assertJsonPath('0.text', 'Website menarik.')->assertJsonMissingPath('0.owner');
        $this->withSession(['guestbook_owner' => 'bob']);
        $this->getJson('/api/guestbook')->assertJsonPath('0.canDelete', false);
        $this->deleteJson('/api/guestbook/'.$comment['id'])->assertForbidden();
        $this->withSession(['guestbook_owner' => 'alice']);
        $this->deleteJson('/api/guestbook/'.$comment['id'])->assertOk();
        $this->getJson('/api/guestbook')->assertExactJson([]);
    }

    public function test_guestbook_rejects_blank_oversized_and_honeypot_payloads(): void
    {
        $this->postJson('/api/guestbook', ['name' => ' ', 'text' => ' '])->assertUnprocessable()->assertJsonValidationErrors(['name', 'text']);
        $this->postJson('/api/guestbook', ['name' => str_repeat('a', 51), 'text' => str_repeat('a', 1001)])->assertUnprocessable();
        $this->postJson('/api/guestbook', ['name' => 'Bot', 'text' => 'Hello', 'website' => 'example.com'])->assertUnprocessable();
    }

    public function test_contact_does_not_report_sent_without_a_mail_transport(): void
    {
        Mail::fake();
        config(['portfolio.mail_enabled' => false]);
        $this->postJson('/api/contact', ['name' => 'Tester', 'email' => 'tester@example.com', 'message' => 'A valid message.'])->assertStatus(409)->assertJsonPath('email', 'mhmmadindrra@gmail.com');
        Mail::assertNothingSent();
    }

    public function test_known_project_routes_render_and_unknown_routes_return_404(): void
    {
        foreach (['pyrorescue', 'siagagambut', 'sipkos'] as $slug) {
            $this->get('/projects/'.$slug)->assertOk()->assertSee('window.__PORTFOLIO__', false);
        }
        $this->get('/projects/unknown')->assertNotFound();
        $this->get('/unknown')->assertNotFound();
    }
}
