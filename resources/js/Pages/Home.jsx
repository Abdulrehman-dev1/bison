import AppLayout from '@/Components/Layout/AppLayout';
import CtaBand from '@/Components/CtaBand';
import Eyebrow from '@/Components/Eyebrow';
import SeoHead from '@/Components/SeoHead';
import StatPanel from '@/Components/StatPanel';
import { useTranslation } from '@/hooks/useTranslation';
import { Link } from '@inertiajs/react';
import { ArrowRight, Factory, Package, Store } from 'lucide-react';

export default function Home({ seo, schemas }) {
    const t = useTranslation();
    const home = (key, fallback = '') => t(`pages.home.${key}`, fallback);
    const common = (key, fallback = '') => t(`common.${key}`, fallback);
    const regions = t('regions', []);

    return (
        <AppLayout>
            <SeoHead seo={seo} schemas={schemas} />

            <section className="bt-hero">
                <div className="bt-wrap">
                    <h1>
                        {home('hero_title')}
                        <br />
                        <span className="bt-grad">{home('hero_title_accent')}</span>
                    </h1>
                    <p className="bt-hero-dek">{home('hero_dek')}</p>
                    <StatPanel />
                </div>
            </section>

            <section>
                <div className="bt-wrap">
                    <div className="bt-mission-band">
                        <Eyebrow light>{home('mission_eyebrow', 'Our Mission')}</Eyebrow>
                        <p>{home('mission')}</p>
                    </div>
                </div>
            </section>

            <section>
                <div className="bt-wrap">
                    <div className="bt-sec-head">
                        <Eyebrow>{home('audiences_eyebrow', 'Who We Work With')}</Eyebrow>
                        <h2>{home('audiences_title')}</h2>
                        <p>{home('audiences_dek')}</p>
                    </div>
                    <div className="bt-card-grid">
                        <div className="bt-card">
                            <div className="bt-ico">
                                <Package size={22} strokeWidth={1.75} />
                            </div>
                            <h3>{home('audience_brands_title', 'For Brands')}</h3>
                            <p>{home('audience_brands_copy')}</p>
                            <Link href={route('brands')} className="bt-link-cta">
                                {home('audience_brands_link', 'See how it works')} <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="bt-card">
                            <div className="bt-ico">
                                <Store size={22} strokeWidth={1.75} />
                            </div>
                            <h3>{home('audience_retailers_title', 'For Retailers')}</h3>
                            <p>{home('audience_retailers_copy')}</p>
                            <Link href={route('retailers')} className="bt-link-cta">
                                {home('audience_retailers_link', "See what's available")} <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="bt-card">
                            <div className="bt-ico">
                                <Factory size={22} strokeWidth={1.75} />
                            </div>
                            <h3>{home('audience_manufacturers_title', 'For Manufacturers')}</h3>
                            <p>{home('audience_manufacturers_copy')}</p>
                            <Link href={route('manufacturers')} className="bt-link-cta">
                                {home('audience_manufacturers_link', 'See how to partner')} <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="bt-wrap">
                    <div className="bt-sec-head">
                        <Eyebrow>{home('regions_eyebrow', 'Where We Work')}</Eyebrow>
                        <h2>{home('regions_title')}</h2>
                    </div>
                    <div className="bt-regions-row">
                        {(Array.isArray(regions) ? regions : []).map((region) => (
                            <div className="bt-region" key={region.title}>
                                <span className="bt-badge">{region.badge}</span>
                                <h4>{region.title}</h4>
                                <p>{region.copy}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <CtaBand
                heading={home('cta_heading')}
                copy={home('cta_copy')}
                primary={{ label: common('request_quote', 'Request a Quote'), href: route('contact.request') }}
                secondary={{ label: home('cta_secondary_label', 'Become a Manufacturing Partner'), href: route('contact.partner') }}
            />
        </AppLayout>
    );
}
