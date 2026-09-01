import AppLayout from '@/Components/Layout/AppLayout';
import SeoHead from '@/Components/SeoHead';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Show({ seo, schemas, product }) {
    const { translations } = usePage().props;
    const nav = translations?.nav ?? {};
    const gallery = product.images?.length ? product.images : (product.image_path ? [product.image_path] : []);
    const [activeImage, setActiveImage] = useState(gallery[0] ?? null);

    return (
        <AppLayout>
            <SeoHead seo={seo} schemas={schemas} />

            <section className="bt-page-hero">
                <div className="bt-wrap">
                    <nav className="bt-breadcrumb" aria-label="Breadcrumb">
                        <Link href={route('home')}>{nav.home ?? 'Home'}</Link>
                        <span>/</span>
                        <Link href={route('catalogue')}>{nav.catalogue ?? 'Catalogue'}</Link>
                        <span>/</span>
                        <span>{product.name}</span>
                    </nav>

                    <div className="bt-product-detail">
                        <div className="bt-product-gallery">
                            <div className="bt-product-detail-img">
                                {activeImage ? (
                                    <img src={activeImage} alt={product.name} />
                                ) : (
                                    <span className="bt-product-img-placeholder">No image</span>
                                )}
                            </div>
                            {gallery.length > 1 && (
                                <div className="bt-product-thumbs">
                                    {gallery.map((image) => (
                                        <button
                                            key={image}
                                            type="button"
                                            className={`bt-product-thumb ${activeImage === image ? 'is-active' : ''}`}
                                            onClick={() => setActiveImage(image)}
                                        >
                                            <img src={image} alt="" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="bt-h1-page">{product.name}</h1>
                            <p className="bt-hero-dek">{product.description}</p>
                            <div className="bt-hero-ctas">
                                <Link href={route('contact.request')} className="bt-btn bt-btn-solid">
                                    Request a Quote <ArrowRight size={16} />
                                </Link>
                                <Link href={route('catalogue')} className="bt-btn bt-btn-line">
                                    Back to catalogue
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
