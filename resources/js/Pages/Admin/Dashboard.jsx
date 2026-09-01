import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { ClipboardList, Package, Plus } from 'lucide-react';

export default function Dashboard({ stats }) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            <div className="adm-stat-grid">
                <div className="adm-stat-card">
                    <div className="adm-stat-icon copper"><ClipboardList size={22} /></div>
                    <div>
                        <p className="adm-stat-label">New submissions</p>
                        <p className="adm-stat-value">{stats.newSubmissions}</p>
                    </div>
                </div>
                <div className="adm-stat-card">
                    <div className="adm-stat-icon blue"><ClipboardList size={22} /></div>
                    <div>
                        <p className="adm-stat-label">Total submissions</p>
                        <p className="adm-stat-value">{stats.totalSubmissions}</p>
                    </div>
                </div>
                <div className="adm-stat-card">
                    <div className="adm-stat-icon green"><Package size={22} /></div>
                    <div>
                        <p className="adm-stat-label">Active products</p>
                        <p className="adm-stat-value">{stats.activeProducts}</p>
                    </div>
                </div>
            </div>

            <div className="adm-panel">
                <div className="adm-panel-header">
                    <h2 className="adm-panel-title">Quick actions</h2>
                </div>
                <div className="adm-panel-body" style={{ padding: '20px 22px', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    <Link href={route('admin.submissions.index')} className="adm-btn adm-btn-primary">
                        <ClipboardList size={16} /> View submissions
                    </Link>
                    <Link href={route('admin.products.index')} className="adm-btn adm-btn-ghost">
                        <Package size={16} /> Manage products
                    </Link>
                    <Link href={route('admin.products.create')} className="adm-btn adm-btn-copper">
                        <Plus size={16} /> Add product
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
