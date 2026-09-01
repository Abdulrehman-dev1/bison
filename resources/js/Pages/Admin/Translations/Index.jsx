import AdminPagination from '@/Components/Admin/AdminPagination';
import { IconAction, IconActions } from '@/Components/Admin/IconActions';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { AlertCircle, FolderOpen, Globe, Layers, LayoutGrid, Search, Sparkles } from 'lucide-react';
import { useState } from 'react';

const SECTION_ICONS = {
    'Site-wide': Globe,
    Pages: LayoutGrid,
    SEO: Sparkles,
    'Content blocks': Layers,
};

export default function Index({
    sections,
    groupMeta,
    categoryCard,
    locales,
    results,
    filters,
    missingCounts,
    totalKeys,
}) {
    const [q, setQ] = useState(filters.q ?? '');
    const [group, setGroup] = useState(filters.group ?? '');
    const [locale, setLocale] = useState(filters.locale ?? '');

    const search = (event) => {
        event.preventDefault();
        router.get(route('admin.translations.index'), { q, group, locale }, { preserveState: true });
    };

    const clearSearch = () => {
        setQ('');
        setGroup('');
        setLocale('');
        router.get(route('admin.translations.index'));
    };

    const searchActive = Boolean(results);

    return (
        <AdminLayout title="Translations">
            <Head title="Translations" />

            <div className="adm-trans-callout">
                <AlertCircle size={18} />
                <div>
                    <strong>How new static text works</strong>
                    <p>
                        Hardcoded paragraphs in your React/PHP code do <em>not</em> appear here automatically.
                        To make copy editable: use <code>t('group.key')</code> in code, then add that key here
                        (open a group → <strong>Add new key</strong>) or run the translation seeder for bulk imports.
                    </p>
                </div>
            </div>

            <div className="adm-trans-stats">
                <div className="adm-trans-stat">
                    <span className="adm-trans-stat-label">Total strings</span>
                    <strong>{totalKeys}</strong>
                </div>
                {locales.map(({ code, native_name }) => (
                    <div key={code} className={`adm-trans-stat ${missingCounts[code] ? 'has-missing' : 'is-complete'}`}>
                        <span className="adm-trans-stat-label">{native_name}</span>
                        <strong>{missingCounts[code] ?? 0}</strong>
                        <span className="adm-trans-stat-hint">{missingCounts[code] ? 'missing' : 'complete'}</span>
                    </div>
                ))}
            </div>

            <form onSubmit={search} className="adm-trans-search">
                <div className="adm-trans-search-grid">
                    <div className="adm-form-group">
                        <label className="adm-label">Search strings</label>
                        <input className="adm-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search keys or values…" />
                    </div>
                    <div className="adm-form-group">
                        <label className="adm-label">Group</label>
                        <select className="adm-select" value={group} onChange={(e) => setGroup(e.target.value)}>
                            <option value="">All groups</option>
                            {sections.flatMap((section) => section.groups).map((key) => (
                                <option key={key} value={key}>{key}</option>
                            ))}
                        </select>
                    </div>
                    <div className="adm-form-group">
                        <label className="adm-label">Locale</label>
                        <select className="adm-select" value={locale} onChange={(e) => setLocale(e.target.value)}>
                            <option value="">All locales</option>
                            {locales.map(({ code, native_name }) => (
                                <option key={code} value={code}>{native_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="adm-trans-search-actions">
                        <button type="submit" className="adm-btn adm-btn-copper">
                            <Search size={16} /> Search
                        </button>
                        {searchActive && (
                            <button type="button" className="adm-btn adm-btn-ghost" onClick={clearSearch}>
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </form>

            {searchActive ? (
                <div className="adm-panel">
                    <div className="adm-panel-header">
                        <h2 className="adm-panel-title">Search results</h2>
                        <span className="adm-panel-meta">{results.total} matches</span>
                    </div>
                    <div className="adm-panel-body">
                        {results.data.length === 0 ? (
                            <div className="adm-empty">No strings matched your search.</div>
                        ) : (
                            <table className="adm-table">
                                <thead>
                                    <tr>
                                        <th>Group</th>
                                        <th>Key</th>
                                        <th>Locale</th>
                                        <th>Value</th>
                                        <th />
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.data.map((row) => (
                                        <tr key={row.id}>
                                            <td><span className="adm-chip">{row.group}</span></td>
                                            <td><code>{row.key}</code></td>
                                            <td>{row.locale.toUpperCase()}</td>
                                            <td className="adm-cell-truncate">{row.value}</td>
                                            <td>
                                                <IconAction
                                                    href={route('admin.translations.edit', row.group)}
                                                    variant="edit"
                                                    label="Edit group"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <AdminPagination paginator={results} />
                    </div>
                </div>
            ) : (
                <>
                    {sections.map((section) => {
                        const Icon = SECTION_ICONS[section.title] ?? FolderOpen;

                        return (
                            <div key={section.title} className="adm-trans-section">
                                <div className="adm-trans-section-head">
                                    <div className="adm-trans-section-icon">
                                        <Icon size={18} />
                                    </div>
                                    <div>
                                        <h2>{section.title}</h2>
                                        <p>{section.description}</p>
                                    </div>
                                </div>
                                <div className="adm-trans-group-grid">
                                    {section.groups.map((groupKey) => {
                                        const card = groupMeta[groupKey];
                                        if (!card) return null;

                                        return (
                                            <Link
                                                key={card.key}
                                                href={route('admin.translations.edit', card.key)}
                                                className="adm-trans-group-card"
                                            >
                                                <FolderOpen size={20} />
                                                <div>
                                                    <strong>{card.label}</strong>
                                                    <span>{card.key}</span>
                                                </div>
                                                <em>{card.keys_count} keys</em>
                                            </Link>
                                        );
                                    })}
                                    {section.title === 'Pages' && categoryCard && (
                                        <Link href={categoryCard.href} className="adm-trans-group-card is-accent">
                                            <FolderOpen size={20} />
                                            <div>
                                                <strong>{categoryCard.label}</strong>
                                                <span>category</span>
                                            </div>
                                            <em>{categoryCard.keys_count} items</em>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
        </AdminLayout>
    );
}
