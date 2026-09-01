import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AdminLayout title="Profile settings">
            <Head title="Profile settings" />

            <Link href={route('admin.dashboard')} className="adm-btn adm-btn-ghost adm-btn-sm" style={{ marginBottom: 20 }}>
                <ArrowLeft size={14} /> Back to dashboard
            </Link>

            <div className="adm-form-panel" style={{ marginBottom: 16 }}>
                <UpdateProfileInformationForm
                    mustVerifyEmail={mustVerifyEmail}
                    status={status}
                />
            </div>

            <div className="adm-form-panel" style={{ marginBottom: 16 }}>
                <UpdatePasswordForm />
            </div>

            <div className="adm-form-panel">
                <DeleteUserForm />
            </div>
        </AdminLayout>
    );
}
