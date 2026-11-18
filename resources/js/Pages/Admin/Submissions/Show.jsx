import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

export default function Show({ submission }) {
    const { auth } = usePage().props;
    const canManage = auth?.user?.permissions?.includes('submissions.manage');

    const { data, setData, patch, processing } = useForm({ status: submission.status });

    const updateStatus = (event) => {
        event.preventDefault();
        patch(route('admin.submissions.update', submission.id), { preserveScroll: true });
    };

    return (
        <AdminLayout title={`Submission — ${submission.name}`}>
            <Head title={`Submission — ${submission.name}`} />

            <Link href={route('admin.submissions.index')} className="adm-btn adm-btn-ghost adm-btn-sm" style={{ marginBottom: 20 }}>
                <ArrowLeft size={14} /> Back to submissions
            </Link>

            <div className="adm-detail-layout">
                <div className="adm-panel">
                    <div className="adm-panel-header">
                        <h2 className="adm-panel-title">Message</h2>
                        <span className={`adm-badge adm-badge-${submission.status}`}>{submission.status}</span>
                    </div>
                    <div style={{ padding: '22px' }}>
                        <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.65, margin: 0 }}>{submission.detail || '—'}</p>
                        {Array.isArray(submission.items) && submission.items.length > 0 && (
                            <div style={{ marginTop: 22 }}>
                                <h3 style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 10px' }}>Requested items</h3>
                                <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
                                    {submission.items.map((item) => (
                                        <li key={item.sku}>
                                            {item.name}
                                            {item.variant ? ` — ${item.variant}` : ''}
                                            {item.sku ? ` (${item.sku})` : ''}
                                            {item.qty ? ` · Qty ${item.qty}` : ''}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div className="adm-panel">
                        <div className="adm-panel-header"><h2 className="adm-panel-title">Details</h2></div>
                        <div style={{ padding: '18px 22px' }}>
                            <dl style={{ fontSize: 14 }}>
                                {[
                                    ['Name', submission.name],
                                    ['Email', submission.email],
                                    submission.company ? ['Company', submission.company] : null,
                                    ['Intent', submission.intent],
                                    ['Received', new Date(submission.created_at).toLocaleString()],
                                    submission.ip_address ? ['IP', submission.ip_address] : null,
                                ].filter(Boolean).map(([label, value]) => (
                                    <div key={label} style={{ marginBottom: 14 }}>
                                        <dt style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--adm-muted)', marginBottom: 3 }}>{label}</dt>
                                        <dd style={{ margin: 0 }}>{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>

                    {canManage && (
                        <form onSubmit={updateStatus} className="adm-form-panel" style={{ maxWidth: 'none' }}>
                            <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 14px' }}>Update status</h3>
                            <select className="adm-select" value={data.status} onChange={(e) => setData('status', e.target.value)} style={{ marginBottom: 14 }}>
                                <option value="new">New</option>
                                <option value="read">Read</option>
                                <option value="archived">Archived</option>
                            </select>
                            <button type="submit" className="adm-btn adm-btn-copper" style={{ width: '100%' }} disabled={processing}>
                                <Save size={16} /> {processing ? 'Saving…' : 'Update status'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
