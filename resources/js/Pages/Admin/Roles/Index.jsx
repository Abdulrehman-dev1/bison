import ConfirmModal from '@/Components/Admin/ConfirmModal';
import { IconAction, IconActions } from '@/Components/Admin/IconActions';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function Index({ roles, permissions }) {
    const [confirm, setConfirm] = useState(null);

    const destroy = () => {
        if (!confirm) return;
        router.delete(route('admin.roles.destroy', confirm.id), {
            onFinish: () => setConfirm(null),
        });
    };

    return (
        <AdminLayout
            title="Roles & Permissions"
            actions={
                <Link href={route('admin.roles.create')} className="adm-btn adm-btn-copper adm-btn-sm">
                    <Plus size={16} /> Create role
                </Link>
            }
        >
            <Head title="Roles" />

            <div className="adm-page-grid-2">
                <div className="adm-panel">
                    <div className="adm-panel-header">
                        <h2 className="adm-panel-title">Roles ({roles.length})</h2>
                    </div>
                    <div className="adm-panel-body">
                        <table className="adm-table">
                            <thead>
                                <tr>
                                    <th>Role</th>
                                    <th>Permissions</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.map((role) => (
                                    <tr key={role.id}>
                                        <td>
                                            <strong style={{ textTransform: 'capitalize' }}>{role.name.replace('-', ' ')}</strong>
                                            {role.is_protected && (
                                                <span className="adm-badge adm-badge-read" style={{ marginLeft: 8 }}>Protected</span>
                                            )}
                                        </td>
                                        <td style={{ color: 'var(--adm-muted)', fontSize: 13 }}>
                                            {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}
                                        </td>
                                        <td>
                                            <IconActions>
                                                <IconAction
                                                    href={route('admin.roles.edit', role.id)}
                                                    variant="edit"
                                                    label="Edit role"
                                                />
                                                {!role.is_protected && (
                                                    <IconAction
                                                        variant="delete"
                                                        label="Delete role"
                                                        onClick={() => setConfirm(role)}
                                                    />
                                                )}
                                            </IconActions>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="adm-panel">
                    <div className="adm-panel-header">
                        <h2 className="adm-panel-title">All permissions</h2>
                    </div>
                    <div style={{ padding: '18px 22px' }}>
                        <ul className="adm-permissions-list">
                            {permissions.map((permission) => (
                                <li key={permission}>{permission}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <ConfirmModal
                open={Boolean(confirm)}
                title="Delete role?"
                message={confirm ? `Delete role "${confirm.name}"? Users assigned to this role must be reassigned first.` : ''}
                confirmLabel="Delete role"
                onConfirm={destroy}
                onCancel={() => setConfirm(null)}
            />
        </AdminLayout>
    );
}
