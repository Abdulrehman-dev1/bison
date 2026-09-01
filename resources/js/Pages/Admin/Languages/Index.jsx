import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Globe, Plus } from 'lucide-react';
import { useState } from 'react';

export default function Index({ locales }) {
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
        name: '',
        native_name: '',
        is_active: true,
        copy_from_default: true,
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('admin.languages.store'), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    const toggleActive = (locale) => {
        router.put(route('admin.languages.update', locale.code), {
            is_active: !locale.is_active,
        }, { preserveScroll: true });
    };

    const setDefault = (locale) => {
        router.put(route('admin.languages.update', locale.code), {
            is_default: true,
            is_active: true,
        }, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Languages">
            <Head title="Languages" />

            <div className="adm-panel" style={{ marginBottom: 24 }}>
                <div className="adm-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="adm-panel-title">Active languages</h2>
                    <button type="button" className="adm-btn adm-btn-copper adm-btn-sm" onClick={() => setShowForm(!showForm)}>
                        <Plus size={16} /> Add language
                    </button>
                </div>
                <div className="adm-panel-body">
                    <table className="adm-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Native name</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locales.map((locale) => (
                                <tr key={locale.code}>
                                    <td><strong>{locale.code.toUpperCase()}</strong></td>
                                    <td>{locale.name}</td>
                                    <td>{locale.native_name}</td>
                                    <td>
                                        {locale.is_default && <span className="adm-badge adm-badge-active" style={{ marginRight: 6 }}>Default</span>}
                                        <span className={`adm-badge ${locale.is_active ? 'adm-badge-active' : 'adm-badge-inactive'}`}>
                                            {locale.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        {!locale.is_default && (
                                            <>
                                                <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => toggleActive(locale)}>
                                                    {locale.is_active ? 'Deactivate' : 'Activate'}
                                                </button>
                                                <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setDefault(locale)}>
                                                    Set default
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && (
                <form onSubmit={submit} className="adm-form-panel">
                    <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Globe size={18} /> Add new language
                    </h3>
                    <div className="adm-form-grid-3">
                        <div className="adm-form-group">
                            <label className="adm-label">Code</label>
                            <input className="adm-input" value={data.code} onChange={(e) => setData('code', e.target.value.toLowerCase())} placeholder="fr" required />
                            {errors.code && <p className="adm-error-text">{errors.code}</p>}
                        </div>
                        <div className="adm-form-group">
                            <label className="adm-label">Name</label>
                            <input className="adm-input" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="French" required />
                        </div>
                        <div className="adm-form-group">
                            <label className="adm-label">Native name</label>
                            <input className="adm-input" value={data.native_name} onChange={(e) => setData('native_name', e.target.value)} placeholder="Français" required />
                        </div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 14 }}>
                        <input type="checkbox" checked={data.copy_from_default} onChange={(e) => setData('copy_from_default', e.target.checked)} />
                        Copy all strings from default language as starting point
                    </label>
                    <button type="submit" className="adm-btn adm-btn-copper" disabled={processing}>
                        {processing ? 'Adding…' : 'Add language'}
                    </button>
                </form>
            )}
        </AdminLayout>
    );
}
