import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function Show({ log }) {
    return (
        <AdminLayout title="Audit Entry">
            <Head title="Audit Entry" />

            <Link href={route('admin.audit.index')} className="adm-btn adm-btn-ghost adm-btn-sm" style={{ marginBottom: 20 }}>
                <ArrowLeft size={14} /> Back to audit log
            </Link>

            <div className="adm-panel" style={{ maxWidth: 720 }}>
                <div className="adm-panel-header">
                    <h2 className="adm-panel-title">{log.action}</h2>
                    <span style={{ fontSize: 13, color: 'var(--adm-muted)' }}>
                        {new Date(log.created_at).toLocaleString()}
                    </span>
                </div>
                <div style={{ padding: '22px' }}>
                    <p style={{ fontSize: 15, margin: '0 0 24px', lineHeight: 1.6 }}>{log.description}</p>

                    <dl style={{ fontSize: 14 }}>
                        {[
                            ['User', log.user ? `${log.user.name} (${log.user.email})` : 'System / Guest'],
                            ['IP address', log.ip_address ?? '—'],
                            ['User agent', log.user_agent ?? '—'],
                            log.subject_type ? ['Subject', `${log.subject_type} #${log.subject_id}`] : null,
                        ].filter(Boolean).map(([label, value]) => (
                            <div key={label} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--adm-border)' }}>
                                <dt style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--adm-muted)', marginBottom: 4 }}>{label}</dt>
                                <dd style={{ margin: 0, wordBreak: 'break-all' }}>{value}</dd>
                            </div>
                        ))}
                    </dl>

                    {log.properties && Object.keys(log.properties).length > 0 && (
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--adm-muted)', marginBottom: 8 }}>Properties</p>
                            <pre style={{ background: 'var(--adm-cream)', padding: 16, borderRadius: 10, fontSize: 12, overflow: 'auto', margin: 0 }}>
                                {JSON.stringify(log.properties, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
