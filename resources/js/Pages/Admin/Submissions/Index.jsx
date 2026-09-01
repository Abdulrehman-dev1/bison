import AdminPagination from '@/Components/Admin/AdminPagination';
import { IconAction, IconActions } from '@/Components/Admin/IconActions';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ submissions, filters }) {
    const updateFilters = (key, value) => {
        router.get(route('admin.submissions.index'), { ...filters, [key]: value || undefined }, { preserveState: true, replace: true });
    };

    return (
        <AdminLayout title="Contact Submissions">
            <Head title="Submissions" />

            <div className="adm-filters">
                <select className="adm-select" value={filters.intent ?? ''} onChange={(e) => updateFilters('intent', e.target.value)}>
                    <option value="">All intents</option>
                    <option value="general">General</option>
                    <option value="request">Request</option>
                    <option value="partner">Partner</option>
                </select>
                <select className="adm-select" value={filters.status ?? ''} onChange={(e) => updateFilters('status', e.target.value)}>
                    <option value="">All statuses</option>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="archived">Archived</option>
                </select>
            </div>

            <div className="adm-panel">
                <div className="adm-panel-body">
                    <table className="adm-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Intent</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.data.map((submission) => (
                                <tr key={submission.id}>
                                    <td style={{ color: 'var(--adm-muted)' }}>
                                        {new Date(submission.created_at).toLocaleDateString()}
                                    </td>
                                    <td><strong>{submission.name}</strong></td>
                                    <td style={{ color: 'var(--adm-muted)' }}>{submission.email}</td>
                                    <td><span className="adm-badge adm-badge-read">{submission.intent}</span></td>
                                    <td><span className={`adm-badge adm-badge-${submission.status}`}>{submission.status}</span></td>
                                    <td>
                                        <IconActions>
                                            <IconAction
                                                href={route('admin.submissions.show', submission.id)}
                                                variant="view"
                                                label="View submission"
                                            />
                                        </IconActions>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <AdminPagination paginator={submissions} />
                </div>
            </div>
        </AdminLayout>
    );
}
