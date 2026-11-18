import AppLayout from '@/Components/Layout/AppLayout';
import CtaBand from '@/Components/CtaBand';
import Eyebrow from '@/Components/Eyebrow';
import SeoHead from '@/Components/SeoHead';
import { useTranslation } from '@/hooks/useTranslation';
import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Compass,
    Footprints,
    Layers,
    Repeat2,
    Shirt,
    ShoppingBag,
} from 'lucide-react';

function HatIcon({ size = 22 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 16c2.5 2 17.5 2 20 0" />
            <path d="M5 16.5c.5-4 1.5-9 4-9 1.2 0 1.8 1 3 1s1.8-1 3-1c2.5 0 3.5 5 4 9" />
            <path d="M6 13.5c3.5 1 8.5 1 12 0" />
        </svg>
    );
}

const CATEGORY_ICONS = {
    Compass,
    Footprints,
    Shirt,
    ShoppingBag,
    Layers,
    Repeat2,
    Hat: HatIcon,
};

export default function Retailers({ seo, schemas, categories = [] }) {
    const t = useTranslation();
    const { translations } = usePage().props;
    const common = translations?.common ?? {};
    const page = (key, fallback = '') => t(`pages.retailers.${key}`, fallback);
    const steps = t('steps.retail', []);

    const categoryCards = (Array.isArray(categories) ? categories : []).map((category) => ({
        ...category,
        Icon: CATEGORY_ICONS[category.icon] ?? Compass,
    }));

    return (
        <AppLayout>
            <SeoHead seo={seo} schemas={schemas} />

            <section className="bt-page-hero">
                <div className="bt-wrap">
                    <h1 className="bt-h1-page">{page('hero_title')}</h1>
                    <p className="bt-hero-dek">{page('hero_dek')}</p>
                    <Link href={route('catalogue')} className="bt-btn bt-btn-solid">
                        {common.view_catalogue ?? 'View full catalogue'} <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            <section>
                <div className="bt-wrap">
                    <div className="bt-sec-head">
                        <Eyebrow>{page('lines_eyebrow', "What's available")}</Eyebrow>
                        <h2>{page('lines_title', 'Lines you can order now')}</h2>
                    </div>
                    <div className="bt-card-grid">
                        {categoryCards.map(({ slug, Icon, title, copy }) => (
                            <Link className="bt-card" key={slug} href={route('catalogue.line', slug)}>
                                <div className="bt-ico">
                                    <Icon size={22} strokeWidth={1.75} />
                                </div>
                                <h3>{title}</h3>
                                <p>{copy}</p>
                                <span className="bt-link-cta">{page('browse', 'Browse')} <ArrowRight size={14} /></span>
                            </Link>
                        ))}
                    </div>
                    <p style={{ marginTop: 24 }}>
                        <Link href={route('catalogue')} className="bt-link-cta">
                            {common.view_catalogue ?? 'View full catalogue'} <ArrowRight size={14} />
                        </Link>
                    </p>
                </div>
            </section>

            <section>
                <div className="bt-wrap">
                    <div className="bt-sec-head">
                        <Eyebrow>{page('steps_eyebrow', 'How it works')}</Eyebrow>
                        <h2>{page('steps_title', 'From your list to your dock')}</h2>
                    </div>
                    <div className="bt-steps-row">
                        {(Array.isArray(steps) ? steps : []).map((step) => (
                            <div className="bt-step-card" key={step.n}>
                                <div className="bt-step-no">{step.n}</div>
                                <h4>{step.t}</h4>
                                <p>{step.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <CtaBand
                heading={page('cta_heading', 'Tell us what you want to carry.')}
                copy={page('cta_copy', "Share the category and volume, and we'll tell you what's available.")}
                primary={{ label: common.request_quote ?? 'Request a Quote', href: route('contact.request') }}
            />
        </AppLayout>
    );
}
