<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'dashboard.view',
            'submissions.view',
            'submissions.manage',
            'products.view',
            'products.manage',
            'users.view',
            'users.manage',
            'roles.manage',
            'audit.view',
            'languages.view',
            'languages.manage',
            'translations.view',
            'translations.manage',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission);
        }

        $roles = [
            'super-admin' => $permissions,
            'admin' => [
                'dashboard.view', 'submissions.view', 'submissions.manage', 'products.view', 'products.manage',
                'users.view', 'audit.view', 'languages.view', 'translations.view', 'translations.manage',
            ],
            'editor' => [
                'dashboard.view', 'products.view', 'products.manage', 'translations.view', 'translations.manage',
            ],
            'viewer' => ['dashboard.view', 'submissions.view', 'products.view', 'translations.view'],
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::findOrCreate($roleName);
            $role->syncPermissions($rolePermissions);
        }
    }
}
