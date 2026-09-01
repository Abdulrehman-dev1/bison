import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

export default function Form({ user, roles }) {
    const isEdit = Boolean(user?.id);

    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        password_confirmation: '',
        role: user?.role ?? roles[0] ?? '',
    });

    const submit = (event) => {
        event.preventDefault();
        if (isEdit) {
            put(route('admin.users.update', user.id));
        } else {
            post(route('admin.users.store'));
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit User' : 'New User'}>
            <Head title={isEdit ? 'Edit User' : 'New User'} />

            <Link href={route('admin.users.index')} className="adm-btn adm-btn-ghost adm-btn-sm" style={{ marginBottom: 20 }}>
                <ArrowLeft size={14} /> Back to users
            </Link>

            <form onSubmit={submit} className="adm-form-panel">
                <div className="adm-form-group">
                    <label className="adm-label">Name</label>
                    <input className="adm-input" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                    {errors.name && <p className="adm-error-text">{errors.name}</p>}
                </div>
                <div className="adm-form-group">
                    <label className="adm-label">Email</label>
                    <input type="email" className="adm-input" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                    {errors.email && <p className="adm-error-text">{errors.email}</p>}
                </div>
                <div className="adm-form-group">
                    <label className="adm-label">{isEdit ? 'New password (leave blank to keep)' : 'Password'}</label>
                    <input type="password" className="adm-input" value={data.password} onChange={(e) => setData('password', e.target.value)} {...(!isEdit && { required: true })} />
                    {errors.password && <p className="adm-error-text">{errors.password}</p>}
                </div>
                {!isEdit && (
                    <div className="adm-form-group">
                        <label className="adm-label">Confirm password</label>
                        <input type="password" className="adm-input" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} required />
                    </div>
                )}
                <div className="adm-form-group">
                    <label className="adm-label">Role</label>
                    <select className="adm-select" value={data.role} onChange={(e) => setData('role', e.target.value)} required>
                        {roles.map((role) => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                    {errors.role && <p className="adm-error-text">{errors.role}</p>}
                </div>
                <button type="submit" className="adm-btn adm-btn-copper" disabled={processing}>
                    <Save size={16} /> {processing ? 'Saving…' : isEdit ? 'Update user' : 'Create user'}
                </button>
            </form>
        </AdminLayout>
    );
}
