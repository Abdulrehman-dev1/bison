<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoleRequest;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    private const PROTECTED_ROLES = ['super-admin'];

    public function index(): Response
    {
        return Inertia::render('Admin/Roles/Index', [
            'roles' => Role::with('permissions')->get()->map(fn (Role $role) => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name'),
                'is_protected' => in_array($role->name, self::PROTECTED_ROLES, true),
            ]),
            'permissions' => Permission::query()->pluck('name'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Roles/Form', [
            'role' => null,
            'permissions' => Permission::query()->pluck('name'),
        ]);
    }

    public function store(StoreRoleRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $role = Role::create(['name' => $data['name'], 'guard_name' => 'web']);
        $role->syncPermissions($data['permissions']);

        AuditService::log(
            'role.created',
            "Created role \"{$role->name}\" with ".count($data['permissions']).' permissions.',
            $role,
            ['permissions' => $data['permissions']],
            $request,
        );

        return redirect()->route('admin.roles.index')->with('success', 'Role created successfully.');
    }

    public function edit(Role $role): Response
    {
        return Inertia::render('Admin/Roles/Form', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name'),
                'is_protected' => in_array($role->name, self::PROTECTED_ROLES, true),
            ],
            'permissions' => Permission::query()->pluck('name'),
        ]);
    }

    public function update(StoreRoleRequest $request, Role $role): RedirectResponse
    {
        if (in_array($role->name, self::PROTECTED_ROLES, true) && $request->input('name') !== $role->name) {
            return back()->with('error', 'The super-admin role name cannot be changed.');
        }

        $data = $request->validated();

        if (! in_array($role->name, self::PROTECTED_ROLES, true)) {
            $role->update(['name' => $data['name']]);
        }

        $role->syncPermissions($data['permissions']);

        AuditService::log(
            'role.updated',
            "Updated role \"{$role->name}\".",
            $role,
            ['permissions' => $data['permissions']],
            $request,
        );

        return redirect()->route('admin.roles.index')->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        if (in_array($role->name, self::PROTECTED_ROLES, true)) {
            return back()->with('error', 'The super-admin role cannot be deleted.');
        }

        if ($role->users()->count() > 0) {
            return back()->with('error', 'Cannot delete a role that is assigned to users.');
        }

        $name = $role->name;
        $role->delete();

        AuditService::log('role.deleted', "Deleted role \"{$name}\".");

        return redirect()->route('admin.roles.index')->with('success', 'Role deleted successfully.');
    }
}
