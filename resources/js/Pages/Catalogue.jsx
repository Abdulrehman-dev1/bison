import AppLayout from '@/Components/Layout/AppLayout';
import CtaBand from '@/Components/CtaBand';
import SeoHead from '@/Components/SeoHead';
import { useTranslation } from '@/hooks/useTranslation';
import { Link } from '@inertiajs/react';
import { Check, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { addRequestItem, openRequest, useRequestCart } from '@/requestCart';

const DEPT_KEYS = {
    Women: 'dept_women',
    Men: 'dept_men',
    Unisex: 'dept_unisex',
    Kids: 'dept_kids',
};

function fill(template, values) {
    return Object.entries(values).reduce(
        (text, [key, value]) => text.replaceAll(`:${key}`, value ?? ''),
        template,
    );
}

function colorOptions(product) {
    if (Array.isArray(product.k) && product.k.length) {
        return product.k.map(([name, swatch, sku]) => ({
            name,
            swatch: Array.isArray(swatch) ? swatch : [],
            sku: sku || product.c,
        }));
    }

    if (Array.isArray(product.s) && product.s.length > 1) {
        return product.s.map(([sku, name]) => ({
            name: name || sku,
            swatch: [],
            sku,
        }));
    }

    return [];
}

function styleCode(code) {
    return String(code || '').replace(/-[A-Z]{3}$/, '');
}

function styleImages(product) {
    const images = [];

    if (product.i) {
        images.push(product.i);
    }

    for (const src of product.g || []) {
        if (src && !images.includes(src)) {
            images.push(src);
        }
    }

    return images;
}

function imagesFor(product, selected) {
    const own = selected?.sku ? product.photos?.[selected.sku] : null;

    if (Array.isArray(own) && own.length > 0) {
        return own;
    }

    return styleImages(product);
}

function swatchStyle(swatch) {
    if (!swatch?.length) {
        return null;
    }

    if (swatch.length > 1) {
        return { background: `linear-gradient(135deg, ${swatch[0]} 50%, ${swatch[1]} 50%)` };
    }

    return { background: swatch[0] };
}

export default function Catalogue({ seo, schemas, line = null, lines = [], products = [], active = null }) {
    const t = useTranslation();
    const text = (key, fallback = '') => t(`catalog.${key}`, fallback);
    const page = (key, fallback = '') => t(`pages.catalogue.${key}`, fallback);
    const cart = useRequestCart();
    const [type, setType] = useState('');
    const [dept, setDept] = useState('');
    const [query, setQuery] = useState('');
    const [openCode, setOpenCode] = useState(null);
    const [openColor, setOpenColor] = useState(null);
    const [imageIndex, setImageIndex] = useState(0);

    useEffect(() => {
        setType('');
        setDept('');
        setQuery('');
        const style = new URLSearchParams(window.location.search).get('style');
        setOpenCode(style);
        setOpenColor(null);
        setImageIndex(0);
    }, [line]);

    const deptLabel = (value) => text(DEPT_KEYS[value] || '', value);

    const types = useMemo(() => [...new Set(products.map((product) => product.t).filter(Boolean))], [products]);
    const depts = useMemo(() => [...new Set(products.map((product) => product.d).filter(Boolean))], [products]);

    const filtered = useMemo(() => {
        const needle = query.trim().toLowerCase();

        return products.filter((product) => {
            if (type && product.t !== type) {
                return false;
            }

            if (dept && product.d !== dept) {
                return false;
            }

            if (!needle) {
                return true;
            }

            const colors = (product.k || []).map((color) => color[0]).join(' ');
            const haystack = `${product.n} ${product.x || ''} ${product.t} ${product.c} ${colors}`.toLowerCase();

            return haystack.includes(needle);
        });
    }, [products, type, dept, query]);

    const openProduct = products.find((product) => product.c === openCode) ?? null;

    const setStyleParam = (code) => {
        const url = new URL(window.location.href);

        if (code) {
            url.searchParams.set('style', code);
        } else {
            url.searchParams.delete('style');
        }

        window.history.replaceState({}, '', url);
        setOpenCode(code);
        setOpenColor(null);
        setImageIndex(0);
    };

    return (
        <AppLayout>
            <SeoHead seo={seo} schemas={schemas} />

            {!line ? (
                <section className="bt-page-hero">
                    <div className="bt-wrap">
                        <h1 className="bt-h1-page">{page('hero_title', 'Catalog')}</h1>
                        <p className="bt-hero-dek">{page('hero_dek', text('lede'))}</p>
                        <div className="bt-cat-tiles">
                            {lines.map((item) => (
                                <Link key={item.slug} href={route('catalogue.line', item.slug)} className="bt-cat-tile">
                                    <span className="bt-cat-tile-img">
                                        <img src={item.image} alt="" />
                                    </span>
                                    <span className="bt-cat-tile-body">
                                        <h3>{item.title}</h3>
                                        <span>
                                            {item.count} {item.count === 1 ? text('style_one', 'style') : text('styles', 'styles')}
                                        </span>
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            ) : (
                <>
                    <section className="bt-page-hero bt-cat-line">
                        <div className="bt-wrap">
                            <nav className="bt-breadcrumb" aria-label="Breadcrumb">
                                <Link href={route('catalogue')}>{text('back', 'Catalog')}</Link>
                                <span>/</span>
                                <span>{active?.title}</span>
                            </nav>
                            <h1 className="bt-h1-page">{active?.title}</h1>
                            {products.some((product) => product.b) && (
                                <div className="bt-cat-brand">
                                    <img src="/catalog/tradoro.png" alt="Tradoro México" />
                                    <p>{text('brand')}</p>
                                </div>
                            )}
                            <div className="bt-cat-controls">
                                {types.length > 1 && (
                                    <div className="bt-cat-chips" role="group" aria-label="Type">
                                        <button type="button" aria-pressed={!type} onClick={() => setType('')}>{text('all', 'All')}</button>
                                        {types.map((item) => (
                                            <button key={item} type="button" aria-pressed={type === item} onClick={() => setType(item)}>{item}</button>
                                        ))}
                                    </div>
                                )}
                                <div className="bt-cat-control-row">
                                    {depts.length > 1 ? (
                                        <div className="bt-cat-seg" role="group" aria-label="Department">
                                            <button type="button" aria-pressed={!dept} onClick={() => setDept('')}>{text('all', 'All')}</button>
                                            {depts.map((item) => (
                                                <button key={item} type="button" aria-pressed={dept === item} onClick={() => setDept(item)}>{deptLabel(item)}</button>
                                            ))}
                                        </div>
                                    ) : <span />}
                                    <label className="bt-cat-search">
                                        <Search size={16} aria-hidden="true" />
                                        <span className="bt-sr-only">{text('search', 'Search this line')}</span>
                                        <input
                                            type="search"
                                            value={query}
                                            placeholder={text('search', 'Search this line')}
                                            onChange={(event) => setQuery(event.target.value)}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section>
                        <div className="bt-wrap">
                            <p className="bt-cat-result">
                                {fill(text('showing', 'Showing :count of :total styles'), {
                                    count: filtered.length,
                                    total: products.length,
                                })}
                            </p>
                            {filtered.length === 0 ? (
                                <div className="bt-cat-empty">
                                    <p>{text('none', 'No styles match these filters.')}</p>
                                    <button type="button" className="bt-btn bt-btn-solid" onClick={() => { setType(''); setDept(''); setQuery(''); }}>
                                        {text('clear', 'Clear filters')}
                                    </button>
                                </div>
                            ) : (
                                <div className="bt-cat-grid">
                                    {filtered.map((product) => {
                                        const colors = colorOptions(product);
                                        const meta = [product.x, product.d && product.d !== 'Unisex' ? deptLabel(product.d) : ''].filter(Boolean).join(' · ') || product.t;

                                        return (
                                            <button key={product.c} type="button" className="bt-cat-card" onClick={() => setStyleParam(product.c)}>
                                                <span className="bt-cat-card-img">
                                                    {product.i ? <img src={product.i} alt={product.n} /> : <span>{text('soon', 'Photo coming soon')}</span>}
                                                </span>
                                                <span className="bt-cat-card-body">
                                                    <span className="bt-cat-card-name">{product.n}</span>
                                                    <span className="bt-cat-card-meta">{meta}</span>
                                                    {colors.length > 0 && (
                                                        <span className="bt-cat-dots">
                                                            {colors.slice(0, 8).map((color) => (
                                                                <span key={color.sku} className="bt-cat-dot" style={swatchStyle(color.swatch)} />
                                                            ))}
                                                            {colors.length > 8 && <span>+{colors.length - 8}</span>}
                                                        </span>
                                                    )}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </section>
                    <CtaBand
                        heading={fill(text('want', 'Want prices for :line?'), { line: active?.title })}
                        copy={text('want_body')}
                        primary={{
                            label: fill(text('request_sheet', 'Request the :line line sheet'), { line: active?.title }),
                            href: `${route('contact.request')}?line=${encodeURIComponent(active?.title ?? '')}`,
                        }}
                    />
                </>
            )}

            {openProduct && (
                <ProductDialog
                    product={openProduct}
                    colorName={openColor}
                    imageIndex={imageIndex}
                    cart={cart.items}
                    text={text}
                    deptLabel={deptLabel}
                    onClose={() => setStyleParam(null)}
                    onColor={(name) => {
                        setOpenColor(name);
                        setImageIndex(0);
                    }}
                    onImage={setImageIndex}
                />
            )}
        </AppLayout>
    );
}

function ProductDialog({ product, colorName, imageIndex, cart, text, deptLabel, onClose, onColor, onImage }) {
    const colors = colorOptions(product);
    const isOption = !product.k?.length && colors.length > 0;
    const selected = colors.find((color) => color.name === colorName)
        || colors.find((color) => color.name === product.gc)
        || colors[0]
        || null;
    const images = imagesFor(product, selected);
    const showingOwnColor = Boolean(selected?.sku && product.photos?.[selected.sku]?.length);
    const photo = images[imageIndex] || images[0];
    const sku = selected?.sku || product.s?.[0]?.[0] || product.c;
    const inRequest = cart.some((item) => item.sku === sku);
    const meta = [product.t, product.d && product.d !== 'Unisex' ? deptLabel(product.d) : ''].filter(Boolean).join(' · ');
    const facts = [
        [text('style_code', 'Style'), styleCode(product.c)],
        [text('sku', 'SKU'), sku],
        ...(product.z || []).map((row) => {
            const sizes = String(row).match(/^Sizes\s+(.*)$/);

            return sizes ? [text('sizes', 'Sizes'), sizes[1]] : [text('details', 'Details'), row];
        }),
    ];

    useEffect(() => {
        const onKey = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', onKey);
        document.body.classList.add('bt-locked');

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.classList.remove('bt-locked');
        };
    }, [onClose]);

    const add = () => {
        addRequestItem({
            sku,
            name: product.n,
            variant: selected?.name || '',
            image: images[0] || product.i || '',
            line: product.l,
            qty: '',
        });
    };

    return (
        <div className="bt-pv-wrap" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
            <div className="bt-pv" role="dialog" aria-modal="true" aria-labelledby="product-title">
                <button type="button" className="bt-req-x bt-pv-x" onClick={onClose} aria-label={text('close', 'Close')}>
                    <X size={18} />
                </button>
                <div className="bt-pv-gallery">
                    <div className="bt-pv-main">
                        {photo ? <img src={photo} alt={product.n} /> : <span>{text('soon', 'Photo coming soon')}</span>}
                    </div>
                    {images.length > 1 && (
                        <div className="bt-pv-thumbs">
                            {images.map((src, index) => (
                                <button key={src} type="button" aria-pressed={index === imageIndex} onClick={() => onImage(index)}>
                                    <img src={src} alt="" />
                                </button>
                            ))}
                        </div>
                    )}
                    {!showingOwnColor && product.gc && colors.length > 1 && <p className="bt-pv-cap">{fill(text('shown', 'Photos show :color'), { color: product.gc })}</p>}
                </div>
                <div className="bt-pv-info">
                    <p className="bt-pv-meta">
                        {product.b ? <><img src="/catalog/tradoro-mark.png" alt="" /><span>Tradoro</span><span>·</span></> : null}
                        <span>{meta}</span>
                    </p>
                    <h2 id="product-title">{product.n}</h2>
                    {(product.desc || product.x) && <p>{product.desc || product.x}</p>}
                    {colors.length > 0 && (
                        <div>
                            <p className="bt-cat-label">
                                {isOption ? text('options', 'Options') : text('colors', 'Color')}
                                <b>{selected?.name}</b>
                            </p>
                            <div className="bt-cat-swatches">
                                {colors.map((color) => (
                                    <button
                                        key={color.sku}
                                        type="button"
                                        aria-pressed={selected?.sku === color.sku}
                                        onClick={() => onColor(color.name)}
                                    >
                                        {color.swatch.length > 0 && <span className="bt-cat-dot" style={swatchStyle(color.swatch)} />}
                                        {color.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <dl className="bt-cat-facts">
                        {facts.map(([label, value]) => (
                            <div key={`${label}-${value}`}>
                                <dt>{label}</dt>
                                <dd>{value}</dd>
                            </div>
                        ))}
                    </dl>
                    <div className="bt-pv-cta">
                        {inRequest ? (
                            <>
                                <p className="bt-pv-added"><Check size={18} /> {text('added', 'In your request')}{selected ? `: ${selected.name}` : ''}</p>
                                <button type="button" className="bt-btn bt-btn-solid" onClick={() => { onClose(); openRequest(); }}>
                                    {fill(text('view_request', 'View request (:count)'), { count: cart.length })}
                                </button>
                            </>
                        ) : (
                            <>
                                <button type="button" className="bt-btn bt-btn-solid" onClick={add}>
                                    {text('add', 'Add to request')}{selected ? ` · ${selected.name}` : ''}
                                </button>
                                {cart.length > 0 && (
                                    <button type="button" className="bt-btn bt-btn-line" onClick={() => { onClose(); openRequest(); }}>
                                        {fill(text('view_request', 'View request (:count)'), { count: cart.length })}
                                    </button>
                                )}
                            </>
                        )}
                        <p>{text('add_note')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
