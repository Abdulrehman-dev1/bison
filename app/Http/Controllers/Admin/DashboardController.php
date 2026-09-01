<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'newSubmissions' => ContactSubmission::query()->where('status', 'new')->count(),
                'totalSubmissions' => ContactSubmission::query()->count(),
                'activeProducts' => Product::query()->where('is_active', true)->count(),
            ],
        ]);
    }
}
