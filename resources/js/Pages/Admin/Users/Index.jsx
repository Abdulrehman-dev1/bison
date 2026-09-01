import AdminPagination from '@/Components/Admin/AdminPagination';
import { IconAction, IconActions } from '@/Components/Admin/IconActions';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

export default function Index({ users }) {
    return (
        <AdminLayout
            title="Users"
            actions={
                <Link href={route('admin.users.create')} className="adm-btn adm-btn-copper adm-btn-sm">
                    <Plus size={16} /> Add user
                </Link>
            }
        >
            <Head title="Users" />

            <div className="adm-panel">
                <div className="adm-panel-header">
                    <h2 className="adm-panel-title">All users</h2>
                    <span className="adm-panel-meta">{users.total} total</span>
                </div>
                <div className="adm-panel-body">
                    <table className="adm-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((user) => (
                                <tr key={user.id}>
                                    <td><strong>{user.name}</strong></td>
                                    <td style={{ color: 'var(--adm-muted)' }}>{user.email}</td>
                                    <td>
                                        <span className="adm-badge adm-badge-read">{user.roles?.join(', ')}</span>
                                    </td>
                                    <td>
                                        <IconActions>
                                            <IconAction
                                                href={route('admin.users.edit', user.id)}
                                                variant="edit"
                                                label="Edit user"
                                            />
                                        </IconActions>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <AdminPagination paginator={users} />
                </div>
            </div>
        </AdminLayout>
    );
}
