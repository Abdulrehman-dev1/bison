import AppLayout from '@/Components/Layout/AppLayout';
import Eyebrow from '@/Components/Eyebrow';
import SeoHead from '@/Components/SeoHead';
import { Link, usePage } from '@inertiajs/react';

export default function Catalogue({ seo, schemas, products = [], categorySlug = null, categories = {} }) {
    const { translations } = usePage().props;
    const nav = translations?.nav ?? {};

    const categoryEntries = Object.entries(categories);

    return (
        <AppLayout>
            <SeoHead seo={seo} schemas={schemas} />

            <section className="bt-page-hero">
                <div className="bt-wrap">
                    <Eyebrow>Product Catalogue</Eyebrow>
                    <h1 className="bt-h1-page">{nav.catalogue ?? 'Catalogue'}</h1>
                    <p className="bt-hero-dek">
                        Ready-made goods from our vetted manufacturing partners in Mexico.
                        Browse by category or contact us for pricing and availability.
                    </p>
                </div>
            </section>

            <section>
                <div className="bt-wrap">
                    <div className="bt-catalogue-filters">
                        <Link
                            href={route('catalogue')}
                            className={`bt-filter-pill ${!categorySlug ? 'is-active' : ''}`}
                        >
                            All
                        </Link>
                        {categoryEntries.map(([slug, label]) => (
                            <Link
                                key={slug}
                                href={route('catalogue.category', slug)}
                                className={`bt-filter-pill ${categorySlug === slug ? 'is-active' : ''}`}
                            >
                                {typeof label === 'string' ? label : label?.title ?? slug}
                            </Link>
                        ))}
                    </div>

                    {products.length === 0 ? (
                        <p className="bt-hero-dek">No products in this category yet. Check back soon or contact us for availability.</p>
                    ) : (
                        <div className="bt-product-grid">
                            {products.map((product) => (
                                <Link
                                    key={product.slug}
                                    href={route('catalogue.show', product.slug)}
                                    className="bt-product-card"
                                >
                                    <div className="bt-product-img">
                                        {product.image_path ? (
                                            <img src={product.image_path} alt={product.name} />
                                        ) : (
                                            <span className="bt-product-img-placeholder">No image</span>
                                        )}
                                    </div>
                                    <div className="bt-product-body">
                                        <h3>{product.name}</h3>
                                        <p>{product.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </AppLayout>
    );
}
