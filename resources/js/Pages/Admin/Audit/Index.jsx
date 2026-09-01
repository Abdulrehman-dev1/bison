import AdminPagination from '@/Components/Admin/AdminPagination';
import { IconAction, IconActions } from '@/Components/Admin/IconActions';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

const ACTION_LABELS = {
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'contact.submitted': 'Contact form',
    'submission.viewed': 'Submission viewed',
    'submission.updated': 'Submission updated',
    'product.created': 'Product created',
    'product.updated': 'Product updated',
    'product.deleted': 'Product deleted',
    'user.created': 'User created',
    'user.updated': 'User updated',
    'role.created': 'Role created',
    'role.updated': 'Role updated',
    'role.deleted': 'Role deleted',
};

export default function Index({ logs, filters }) {
    const updateFilter = (value) => {
        router.get(route('admin.audit.index'), { action: value || undefined }, { preserveState: true, replace: true });
    };

    return (
        <AdminLayout title="Audit Log">
            <Head title="Audit Log" />

            <div className="adm-filters">
                <input
                    className="adm-input"
                    style={{ width: 280 }}
                    placeholder="Filter by action…"
                    defaultValue={filters.action ?? ''}
                    onKeyDown={(e) => e.key === 'Enter' && updateFilter(e.target.value)}
                />
            </div>

            <div className="adm-panel">
                <div className="adm-panel-header">
                    <h2 className="adm-panel-title">Activity log</h2>
                    <span style={{ fontSize: 13, color: 'var(--adm-muted)' }}>{logs.total} entries</span>
                </div>
                <div className="adm-panel-body">
                    <table className="adm-table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Action</th>
                                <th>Description</th>
                                <th>User</th>
                                <th>IP</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="adm-empty">No audit entries yet.</div>
                                    </td>
                                </tr>
                            ) : (
                                logs.data.map((log) => (
                                    <tr key={log.id}>
                                        <td style={{ color: 'var(--adm-muted)', whiteSpace: 'nowrap', fontSize: 13 }}>
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                        <td>
                                            <span className="adm-badge adm-badge-read">
                                                {ACTION_LABELS[log.action] ?? log.action}
                                            </span>
                                        </td>
                                        <td style={{ maxWidth: 320 }}>{log.description}</td>
                                        <td style={{ color: 'var(--adm-muted)', fontSize: 13 }}>
                                            {log.user?.name ?? '—'}
                                        </td>
                                        <td style={{ color: 'var(--adm-muted)', fontSize: 13 }}>{log.ip_address ?? '—'}</td>
                                        <td>
                                            <IconActions>
                                                <IconAction
                                                    href={route('admin.audit.show', log.id)}
                                                    variant="view"
                                                    label="View details"
                                                />
                                            </IconActions>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    <AdminPagination paginator={logs} />
                </div>
            </div>
        </AdminLayout>
    );
}
