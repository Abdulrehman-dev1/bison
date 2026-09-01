<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactSubmissionController extends Controller
{
    public function index(Request $request): Response
    {
        $submissions = ContactSubmission::query()
            ->when($request->intent, fn ($q) => $q->where('intent', $request->intent))
            ->when($request->status, fn ($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Submissions/Index', [
            'submissions' => $submissions,
            'filters' => $request->only(['intent', 'status']),
        ]);
    }

    public function show(ContactSubmission $submission): Response
    {
        if ($submission->status === 'new' && auth()->user()->can('submissions.manage')) {
            $oldStatus = $submission->status;
            $submission->update(['status' => 'read']);
            AuditService::log(
                'submission.viewed',
                "Marked submission from \"{$submission->name}\" as read.",
                $submission,
                ['from' => $oldStatus, 'to' => 'read'],
            );
        }

        return Inertia::render('Admin/Submissions/Show', [
            'submission' => $submission,
        ]);
    }

    public function update(Request $request, ContactSubmission $submission): RedirectResponse
    {
        $request->validate(['status' => 'required|in:new,read,archived']);

        $oldStatus = $submission->status;
        $submission->update(['status' => $request->status]);

        AuditService::log(
            'submission.updated',
            "Updated submission from \"{$submission->name}\" status to \"{$request->status}\".",
            $submission,
            ['from' => $oldStatus, 'to' => $request->status],
            $request,
        );

        return back()->with('success', 'Submission status updated.');
    }
}
