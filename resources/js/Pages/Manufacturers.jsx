import AppLayout from '@/Components/Layout/AppLayout';
import CtaBand from '@/Components/CtaBand';
import Eyebrow from '@/Components/Eyebrow';
import SeoHead from '@/Components/SeoHead';
import { useTranslation } from '@/hooks/useTranslation';
import { Receipt, Repeat2, Store } from 'lucide-react';

export default function Manufacturers({ seo, schemas }) {
    const t = useTranslation();
    const page = (key, fallback = '') => t(`pages.manufacturers.${key}`, fallback);
    const common = (key, fallback = '') => t(`common.${key}`, fallback);
    const steps = t('steps.placement', []);

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
                        <Eyebrow>{page('why_eyebrow', 'Why partner with us')}</Eyebrow>
                        <h2>{page('why_title', 'One buyer, many shelves')}</h2>
                    </div>
                    <div className="bt-card-grid">
                        <div className="bt-card">
                            <div className="bt-ico">
                                <Store size={22} strokeWidth={1.75} />
                            </div>
                            <h3>{page('reach_title', 'Reach without the hassle')}</h3>
                            <p>{page('reach_copy', 'We find the buyers, manage the relationship, and coordinate freight. You keep making the product and handle standard export paperwork.')}</p>
                        </div>
                        <div className="bt-card">
                            <div className="bt-ico">
                                <Receipt size={22} strokeWidth={1.75} />
                            </div>
                            <h3>{page('pay_title', 'No chasing payments')}</h3>
                            <p>{page('pay_copy', 'You sell to us directly. No chasing payment from retail accounts across the border.')}</p>
                        </div>
                        <div className="bt-card">
                            <div className="bt-ico">
                                <Repeat2 size={22} strokeWidth={1.75} />
                            </div>
                            <h3>{page('grow_title', 'Room to grow the relationship')}</h3>
                            <p>{page('grow_copy', 'Whether it starts with a single order or ongoing production, we stay your point of contact.')}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="bt-wrap">
                    <div className="bt-sec-head">
                        <Eyebrow>{page('steps_eyebrow', 'How it works')}</Eyebrow>
                        <h2>{page('steps_title', 'From conversation to first order')}</h2>
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
                heading={page('cta_heading', 'Become a manufacturing partner.')}
                copy={page('cta_copy', "Tell us what you make and what you can produce. We'll tell you honestly if it's a fit.")}
                primary={{ label: common('become_partner', 'Become a Manufacturing Partner'), href: route('contact.partner') }}
            />
        </AppLayout>
    );
}
