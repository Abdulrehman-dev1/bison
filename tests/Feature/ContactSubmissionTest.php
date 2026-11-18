<?php

namespace Tests\Feature;

use App\Mail\ContactSubmissionReceived;
use App\Models\ContactSubmission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactSubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_request_can_include_catalog_items_without_a_message(): void
    {
        Mail::fake();

        $response = $this->post('/contact', [
            'intent' => 'request',
            'name' => 'Jordan Ramirez',
            'email' => 'jordan@example.com',
            'company' => 'North Line',
            'detail' => '',
            'items' => [[
                'sku' => 'WB-001-BLK',
                'name' => 'Sencilla Leather Chukka Boot',
                'variant' => 'Black',
                'qty' => '24',
                'line' => 'footwear',
                'image' => '/catalog/WB-001.jpg',
            ]],
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', true);

        $submission = ContactSubmission::query()->first();
        $this->assertNotNull($submission);
        $this->assertSame('WB-001-BLK', $submission->items[0]['sku']);
        $this->assertSame('24', $submission->items[0]['qty']);

        Mail::assertSent(ContactSubmissionReceived::class);
    }

    public function test_a_request_without_a_message_or_items_is_rejected(): void
    {
        $response = $this->from('/contact/request-a-quote')->post('/contact', [
            'intent' => 'request',
            'name' => 'Jordan Ramirez',
            'email' => 'jordan@example.com',
            'detail' => '',
            'items' => [],
        ]);

        $response->assertRedirect('/contact/request-a-quote');
        $response->assertSessionHasErrors('detail');
        $this->assertSame(0, ContactSubmission::query()->count());
    }

    public function test_catalog_lines_are_public(): void
    {
        $this->get('/catalogue')->assertOk();
        $this->get('/catalogue/footwear')
            ->assertOk()
            ->assertSee('Sencilla Leather Chukka Boot');
        $this->get('/catalogue/not-a-line')->assertNotFound();
    }
}
