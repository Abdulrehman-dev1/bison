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
    PawPrint,
    Receipt,
    ShieldCheck,
    Shirt,
    ShoppingBag,
    Truck,
} from 'lucide-react';

const CATEGORY_ICONS = {
    Compass,
    PawPrint,
    Footprints,
    Shirt,
    ShoppingBag,
    Layers,
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
                        <Eyebrow>What&apos;s Available</Eyebrow>
                        <h2>Ready-made lines you can stock now</h2>
                    </div>
                    <div className="bt-card-grid">
                        {categoryCards.map(({ slug, Icon, title, copy }) => (
                            <div className="bt-card" key={slug}>
                                <div className="bt-ico">
                                    <Icon size={22} strokeWidth={1.75} />
                                </div>
                                <h3>{title}</h3>
                                <p>{copy}</p>
                            </div>
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
                        <Eyebrow>How It Works</Eyebrow>
                        <h2>From your list to your dock</h2>
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
                heading="Tell us what you want to carry."
                copy="Share the category and volume, and we'll tell you what's available."
                primary={{ label: common.request_quote ?? 'Request a Quote', href: route('contact.request') }}
            />
        </AppLayout>
    );
}
