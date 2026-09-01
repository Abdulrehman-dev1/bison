import AppLayout from '@/Components/Layout/AppLayout';
import CtaBand from '@/Components/CtaBand';
import Eyebrow from '@/Components/Eyebrow';
import SeoHead from '@/Components/SeoHead';
import { useTranslation } from '@/hooks/useTranslation';
import {
    Factory,
    Package,
    Receipt,
    Repeat2,
    ShieldCheck,
    Truck,
} from 'lucide-react';

const SERVICE_ICONS = [Package, Factory, Receipt, Truck, ShieldCheck, Repeat2];

export default function Brands({ seo, schemas }) {
    const t = useTranslation();
    const page = (key, fallback = '') => t(`pages.brands.${key}`, fallback);
    const common = (key, fallback = '') => t(`common.${key}`, fallback);
    const steps = t('steps.sourcing', []);
    const services = t('services', []);

    return (
        <AppLayout>
            <SeoHead seo={seo} schemas={schemas} />

            <section className="bt-page-hero">
                <div className="bt-wrap">
                    <h1 className="bt-h1-page">{page('hero_title')}</h1>
                    <p className="bt-hero-dek">{page('hero_dek')}</p>
                </div>
            </section>

            <section>
                <div className="bt-wrap">
                    <div className="bt-sec-head">
                        <Eyebrow>{page('steps_eyebrow', 'How It Works')}</Eyebrow>
                        <h2>{page('steps_title', 'From spec to your dock')}</h2>
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

            <section>
                <div className="bt-wrap bt-service-list">
                    {(Array.isArray(services) ? services : []).map((service, index) => {
                        const Icon = SERVICE_ICONS[index] ?? Package;

                        return (
                            <div className="bt-service-detail" key={service.title ?? index}>
                                <div className="bt-ico bt-ico-lg">
                                    <Icon size={26} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h3>{service.title}</h3>
                                    <p>{service.copy}</p>
                                    <ul className="bt-bullets">
                                        {(service.bullets ?? []).map((bullet) => (
                                            <li key={bullet}>{bullet}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <CtaBand
                heading={page('cta_heading', 'Get a quote for your product.')}
                copy={page('cta_copy', "Tell us what you're making or ordering. We'll price it and tell you exactly what it takes.")}
                primary={{ label: common('request_quote', 'Request a Quote'), href: route('contact.request') }}
            />
        </AppLayout>
    );
}
