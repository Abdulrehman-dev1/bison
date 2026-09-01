import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

export default function Form({ role, permissions: allPermissions }) {
    const isEdit = Boolean(role?.id);
    const isProtected = role?.is_protected ?? false;

    const { data, setData, post, put, processing, errors } = useForm({
        name: role?.name ?? '',
        permissions: role?.permissions ?? [],
    });

    const togglePermission = (perm) => {
        setData('permissions', data.permissions.includes(perm)
            ? data.permissions.filter((p) => p !== perm)
            : [...data.permissions, perm]);
    };

    const submit = (event) => {
        event.preventDefault();
        if (isEdit) {
            put(route('admin.roles.update', role.id));
        } else {
            post(route('admin.roles.store'));
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Role' : 'Create Role'}>
            <Head title={isEdit ? 'Edit Role' : 'Create Role'} />

            <Link href={route('admin.roles.index')} className="adm-btn adm-btn-ghost adm-btn-sm" style={{ marginBottom: 20 }}>
                <ArrowLeft size={14} /> Back to roles
            </Link>

            <form onSubmit={submit} className="adm-form-panel" style={{ maxWidth: 640 }}>
                <div className="adm-form-group">
                    <label className="adm-label">Role name</label>
                    <input
                        className="adm-input"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="e.g. content-manager"
                        required
                        disabled={isProtected}
                    />
                    <p style={{ fontSize: 12, color: 'var(--adm-muted)', marginTop: 4 }}>
                        Lowercase letters, numbers, and hyphens only.
                    </p>
                    {errors.name && <p className="adm-error-text">{errors.name}</p>}
                </div>

                <div className="adm-form-group">
                    <label className="adm-label">Permissions ({data.permissions.length} selected)</label>
                    <div className="adm-perm-grid">
                        {allPermissions.map((perm) => (
                            <label key={perm} className="adm-perm-check">
                                <input
                                    type="checkbox"
                                    checked={data.permissions.includes(perm)}
                                    onChange={() => togglePermission(perm)}
                                />
                                {perm}
                            </label>
                        ))}
                    </div>
                    {errors.permissions && <p className="adm-error-text">{errors.permissions}</p>}
                </div>

                <button type="submit" className="adm-btn adm-btn-copper" disabled={processing}>
                    <Save size={16} /> {processing ? 'Saving…' : isEdit ? 'Update role' : 'Create role'}
                </button>
            </form>
        </AdminLayout>
    );
}
