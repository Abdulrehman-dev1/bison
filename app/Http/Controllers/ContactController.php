<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Mail\ContactSubmissionReceived;
use App\Models\ContactSubmission;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(StoreContactRequest $request): RedirectResponse
    {
        $submission = ContactSubmission::query()->create([
            ...$request->validated(),
            'ip_address' => $request->ip(),
            'status' => 'new',
        ]);

        Mail::to(config('mail.admin_email', 'contact@bisontradeworks.com'))
            ->send(new ContactSubmissionReceived($submission));

        AuditService::log(
            'contact.submitted',
            "New contact submission from \"{$submission->name}\" ({$submission->intent}).",
            $submission,
            ['intent' => $submission->intent, 'email' => $submission->email],
            $request,
        );

        return back()->with('success', true);
    }
}
