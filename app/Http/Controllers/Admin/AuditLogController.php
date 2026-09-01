<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(Request $request): Response
    {
        $logs = AuditLog::query()
            ->with('user:id,name,email')
            ->when($request->action, fn ($q) => $q->where('action', 'like', '%'.$request->action.'%'))
            ->when($request->user_id, fn ($q) => $q->where('user_id', $request->user_id))
            ->latest('created_at')
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('Admin/Audit/Index', [
            'logs' => $logs,
            'filters' => $request->only(['action', 'user_id']),
        ]);
    }

    public function show(AuditLog $audit): Response
    {
        $audit->load('user:id,name,email');

        return Inertia::render('Admin/Audit/Show', [
            'log' => $audit,
        ]);
    }
}
