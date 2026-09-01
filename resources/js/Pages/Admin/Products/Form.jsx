import ProductImageGallery from '@/Components/Admin/ProductImageGallery';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function emptyTranslations(locales) {
    return locales.reduce((acc, { code }) => {
        acc[code] = {
            name: '',
            description: '',
            slug: '',
            meta_title: '',
            meta_description: '',
        };
        return acc;
    }, {});
}

export default function Form({ product, categories, locales }) {
    const isEdit = Boolean(product?.id);
    const [activeLocale, setActiveLocale] = useState(locales[0]?.code ?? 'en');
    const [imageSubmitError, setImageSubmitError] = useState('');

    const initialTranslations = useMemo(() => {
        const base = emptyTranslations(locales);
        if (product?.translations) {
            Object.entries(product.translations).forEach(([code, fields]) => {
                base[code] = { ...base[code], ...fields };
            });
        }
        return base;
    }, [product, locales]);

    const { data, setData, post, put, processing, errors, transform } = useForm({
        category_slug: product?.category_slug ?? '',
        is_active: product?.is_active ?? true,
        sort_order: product?.sort_order ?? 0,
        translations: initialTranslations,
        existing_image_ids: product?.images?.map((image) => image.id) ?? [],
        removed_image_ids: [],
        images: [],
    });

    const handleImagesChange = useCallback((payload) => {
        setData((current) => ({
            ...current,
            existing_image_ids: payload.existing_image_ids,
            removed_image_ids: payload.removed_image_ids,
            images: payload.images,
        }));
    }, [setData]);

    const setTranslation = (locale, key, value) => {
        setData('translations', {
            ...data.translations,
            [locale]: {
                ...data.translations[locale],
                [key]: value,
            },
        });
    };

    const submit = (event) => {
        event.preventDefault();

        const oversized = (data.images ?? []).find((file) => file.size > MAX_IMAGE_SIZE);

        if (oversized) {
            setImageSubmitError(`"${oversized.name}" is too large. Maximum allowed size is 5 MB per image.`);
            return;
        }

        setImageSubmitError('');

        const hasNewImages = (data.images?.length ?? 0) > 0;
        const options = { preserveScroll: true };

        if (isEdit) {
            if (hasNewImages) {
                // PHP cannot parse multipart bodies on PUT — spoof via POST + _method
                transform((formData) => ({ ...formData, _method: 'put' }));
                post(route('admin.products.update', product.id), {
                    ...options,
                    forceFormData: true,
                });
            } else {
                transform((formData) => {
                    const { _method: _ignored, ...rest } = formData;
                    return rest;
                });
                put(route('admin.products.update', product.id), options);
            }
            return;
        }

        post(route('admin.products.store'), {
            ...options,
            forceFormData: true,
        });
    };

    const current = data.translations[activeLocale] ?? {};

    return (
        <AdminLayout title={isEdit ? 'Edit Product' : 'New Product'}>
            <Head title={isEdit ? 'Edit Product' : 'New Product'} />

            <Link href={route('admin.products.index')} className="adm-btn adm-btn-ghost adm-btn-sm" style={{ marginBottom: 20 }}>
                <ArrowLeft size={14} /> Back to products
            </Link>

            <form onSubmit={submit} className="adm-form-panel">
                {Object.keys(errors).length > 0 && (
                    <div className="adm-form-error-banner">
                        Please fix the errors below and try again.
                    </div>
                )}
                <div className="adm-form-grid-2">
                    <div className="adm-form-group">
                        <label className="adm-label">Category</label>
                        <select className="adm-select" value={data.category_slug} onChange={(e) => setData('category_slug', e.target.value)} required>
                            <option value="">Select category</option>
                            {Object.entries(categories).map(([slug, label]) => (
                                <option key={slug} value={slug}>{label}</option>
                            ))}
                        </select>
                        {errors.category_slug && <p className="adm-error-text">{errors.category_slug}</p>}
                    </div>
                    <div className="adm-form-group">
                        <label className="adm-label">Sort order</label>
                        <input type="number" min="0" className="adm-input" value={data.sort_order} onChange={(e) => setData('sort_order', Number(e.target.value))} />
                    </div>
                </div>

                <ProductImageGallery
                    key={isEdit ? `${product.id}-${(product?.images ?? []).map((image) => image.id).join('-')}` : 'new'}
                    existingImages={product?.images ?? []}
                    onChange={(payload) => {
                        setImageSubmitError('');
                        handleImagesChange(payload);
                    }}
                    errors={errors}
                />

                {imageSubmitError && <p className="adm-error-text">{imageSubmitError}</p>}

                <div className="adm-locale-tabs" style={{ marginBottom: 20 }}>
                    {locales.map(({ code, native_name }) => (
                        <button
                            key={code}
                            type="button"
                            className={`adm-locale-tab ${activeLocale === code ? 'is-active' : ''}`}
                            onClick={() => setActiveLocale(code)}
                        >
                            {native_name}
                        </button>
                    ))}
                </div>

                <div className="adm-form-group">
                    <label className="adm-label">Name ({activeLocale.toUpperCase()})</label>
                    <input
                        className="adm-input"
                        value={current.name ?? ''}
                        onChange={(e) => setTranslation(activeLocale, 'name', e.target.value)}
                        required
                    />
                    {errors[`translations.${activeLocale}.name`] && (
                        <p className="adm-error-text">{errors[`translations.${activeLocale}.name`]}</p>
                    )}
                </div>

                <div className="adm-form-group">
                    <label className="adm-label">Description ({activeLocale.toUpperCase()})</label>
                    <textarea
                        className="adm-textarea"
                        rows={3}
                        value={current.description ?? ''}
                        onChange={(e) => setTranslation(activeLocale, 'description', e.target.value)}
                        required
                    />
                </div>

                <div className="adm-form-group">
                    <label className="adm-label">Slug ({activeLocale.toUpperCase()}) — optional</label>
                    <input
                        className="adm-input"
                        value={current.slug ?? ''}
                        onChange={(e) => setTranslation(activeLocale, 'slug', e.target.value)}
                        placeholder="Auto-generated from name if empty"
                    />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 14 }}>
                    <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                    Active (visible on catalogue)
                </label>

                <button type="submit" className="adm-btn adm-btn-copper" disabled={processing}>
                    <Save size={16} /> {processing ? 'Saving…' : isEdit ? 'Update product' : 'Create product'}
                </button>
            </form>
        </AdminLayout>
    );
}
