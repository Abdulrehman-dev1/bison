import AdminPagination from '@/Components/Admin/AdminPagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Save } from 'lucide-react';
import { useState } from 'react';

function isLongText(key) {
    return key.includes('copy') || key.includes('description') || key.includes('mission') || key.includes('dek') || key.includes('answer') || key.includes('bullets') || key.includes('.d') || key.length > 40;
}

export default function Edit({ group, groupLabel, locales, matrix, keysPaginator, usageHint }) {
    const [showAddKey, setShowAddKey] = useState(false);

    const { data, setData, put, processing } = useForm({
        values: matrix,
    });

    const addKeyForm = useForm({
        key: '',
        default_value: '',
    });

    const setValue = (key, locale, value) => {
        setData('values', {
            ...data.values,
            [key]: {
                ...(data.values[key] ?? {}),
                [locale]: value,
            },
        });
    };

    const submit = (event) => {
        event.preventDefault();
        put(route('admin.translations.update', { group, keys_page: keysPaginator?.current_page }), { preserveScroll: true });
    };

    const addKey = (event) => {
        event.preventDefault();
        addKeyForm.post(route('admin.translations.keys.store', group), {
            preserveScroll: true,
            onSuccess: () => {
                addKeyForm.reset();
                setShowAddKey(false);
            },
        });
    };

    const keys = Object.keys(data.values).sort();

    return (
        <AdminLayout
            title={groupLabel}
            actions={
                <button type="button" className="adm-btn adm-btn-copper adm-btn-sm" onClick={() => setShowAddKey(true)}>
                    <Plus size={16} /> Add new key
                </button>
            }
        >
            <Head title={groupLabel} />

            <Link href={route('admin.translations.index')} className="adm-btn adm-btn-ghost adm-btn-sm" style={{ marginBottom: 20 }}>
                <ArrowLeft size={14} /> Back to translations
            </Link>

            <div className="adm-trans-edit-meta">
                <span className="adm-chip">{group}</span>
                <span className="adm-panel-meta">{keysPaginator?.total ?? keys.length} keys total</span>
            </div>

            <p className="adm-trans-code-hint">{usageHint}</p>

            {showAddKey && (
                <form onSubmit={addKey} className="adm-form-panel adm-trans-add-key">
                    <h3 style={{ marginTop: 0 }}>Add new translation key</h3>
                    <p style={{ color: 'var(--adm-muted)', marginTop: 0 }}>
                        Example key: <code>story_paragraph</code> — then use <code>t('{group}.story_paragraph')</code> in your page.
                    </p>
                    <div className="adm-form-grid-key">
                        <div className="adm-form-group">
                            <label className="adm-label">Key name</label>
                            <input
                                className="adm-input"
                                value={addKeyForm.data.key}
                                onChange={(e) => addKeyForm.setData('key', e.target.value)}
                                placeholder="hero_subtitle"
                                required
                            />
                            {addKeyForm.errors.key && <p className="adm-error-text">{addKeyForm.errors.key}</p>}
                        </div>
                        <div className="adm-form-group">
                            <label className="adm-label">Default text (English)</label>
                            <input
                                className="adm-input"
                                value={addKeyForm.data.default_value}
                                onChange={(e) => addKeyForm.setData('default_value', e.target.value)}
                                placeholder="Your paragraph text…"
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button type="submit" className="adm-btn adm-btn-copper adm-btn-sm" disabled={addKeyForm.processing}>
                            Add key
                        </button>
                        <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setShowAddKey(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <form onSubmit={submit} className="adm-form-panel">
                {keys.length === 0 ? (
                    <div className="adm-empty">
                        <p>No keys in this group yet. Click <strong>Add new key</strong> above.</p>
                    </div>
                ) : (
                    <div className="adm-trans-key-list">
                        {keys.map((key) => (
                            <div key={key} className="adm-translation-row">
                                <div className="adm-translation-key">
                                    <code>{key}</code>
                                </div>
                                <div className="adm-trans-locale-grid" style={{ '--locale-cols': locales.length }}>
                                    {locales.map(({ code, native_name }) => (
                                        <div key={code} className="adm-form-group">
                                            <label className="adm-label">{native_name}</label>
                                            {isLongText(key) ? (
                                                <textarea
                                                    className="adm-textarea"
                                                    rows={3}
                                                    value={data.values[key]?.[code] ?? ''}
                                                    onChange={(e) => setValue(key, code, e.target.value)}
                                                />
                                            ) : (
                                                <input
                                                    className="adm-input"
                                                    value={data.values[key]?.[code] ?? ''}
                                                    onChange={(e) => setValue(key, code, e.target.value)}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {keys.length > 0 && (
                    <div className="adm-trans-edit-footer">
                        <button type="submit" className="adm-btn adm-btn-copper" disabled={processing}>
                            <Save size={16} /> {processing ? 'Saving…' : 'Save this page'}
                        </button>
                        <AdminPagination paginator={keysPaginator} />
                    </div>
                )}
            </form>

            {keys.length === 0 && keysPaginator?.last_page > 1 && (
                <AdminPagination paginator={keysPaginator} />
            )}
        </AdminLayout>
    );
}
