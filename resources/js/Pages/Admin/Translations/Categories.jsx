import AdminPagination from '@/Components/Admin/AdminPagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

export default function Categories({ locales, categories }) {
    const items = categories.data ?? [];

    const { data, setData, put, processing } = useForm({
        categories: items.map((category) => ({
            id: category.id,
            values: category.values,
        })),
    });

    const setValue = (index, locale, key, value) => {
        const next = [...data.categories];
        next[index] = {
            ...next[index],
            values: {
                ...next[index].values,
                [locale]: {
                    ...next[index].values[locale],
                    [key]: value,
                },
            },
        };
        setData('categories', next);
    };

    const saveCategory = (index) => {
        const category = items[index];
        put(route('admin.translations.categories.update', category.id), {
            values: data.categories[index].values,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title="Category translations">
            <Head title="Category translations" />

            <Link href={route('admin.translations.index')} className="adm-btn adm-btn-ghost adm-btn-sm" style={{ marginBottom: 20 }}>
                <ArrowLeft size={14} /> Back to translations
            </Link>

            <div className="adm-panel-header" style={{ marginBottom: 16 }}>
                <span className="adm-panel-meta">{categories.total} categories</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {items.map((category, index) => (
                    <div key={category.id} className="adm-form-panel">
                        <h3 style={{ marginTop: 0 }}>{category.slug}</h3>
                        <div className="adm-trans-locale-grid" style={{ '--locale-cols': locales.length }}>
                            {locales.map(({ code, native_name }) => (
                                <div key={code}>
                                    <div className="adm-form-group">
                                        <label className="adm-label">Title ({native_name})</label>
                                        <input
                                            className="adm-input"
                                            value={data.categories[index]?.values[code]?.title ?? ''}
                                            onChange={(e) => setValue(index, code, 'title', e.target.value)}
                                        />
                                    </div>
                                    <div className="adm-form-group">
                                        <label className="adm-label">Copy ({native_name})</label>
                                        <textarea
                                            className="adm-textarea"
                                            rows={2}
                                            value={data.categories[index]?.values[code]?.copy ?? ''}
                                            onChange={(e) => setValue(index, code, 'copy', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="button" className="adm-btn adm-btn-copper adm-btn-sm" disabled={processing} onClick={() => saveCategory(index)}>
                            <Save size={14} /> Save {category.slug}
                        </button>
                    </div>
                ))}
            </div>

            <div className="adm-panel" style={{ marginTop: 20 }}>
                <AdminPagination paginator={categories} />
            </div>
        </AdminLayout>
    );
}
