import AppLayout from '@/Components/Layout/AppLayout';
import CtaBand from '@/Components/CtaBand';
import Eyebrow from '@/Components/Eyebrow';
import SeoHead from '@/Components/SeoHead';
import { useTranslation } from '@/hooks/useTranslation';
import { Compass, Factory, Receipt, Repeat2, ShieldCheck, Store } from 'lucide-react';

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
                        <Eyebrow>Why Partner With Us</Eyebrow>
                        <h2>Sell to one buyer, not a dozen</h2>
                    </div>
                    <div className="bt-card-grid">
                        <div className="bt-card">
                            <div className="bt-ico">
                                <Store size={22} strokeWidth={1.75} />
                            </div>
                            <h3>Reach without exporting</h3>
                            <p>We manage the buyer relationship and freight coordination, while you handle standard export documentation on your end.</p>
                        </div>
                        <div className="bt-card">
                            <div className="bt-ico">
                                <Receipt size={22} strokeWidth={1.75} />
                            </div>
                            <h3>No chasing payments</h3>
                            <p>You sell to us directly. No chasing payment from retail accounts across the border.</p>
                        </div>
                        <div className="bt-card">
                            <div className="bt-ico">
                                <Repeat2 size={22} strokeWidth={1.75} />
                            </div>
                            <h3>Room to grow the relationship</h3>
                            <p>Whether it starts with a single order or ongoing production, we stay your point of contact.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="bt-wrap">
                    <div className="bt-sec-head">
                        <Eyebrow>How It Works</Eyebrow>
                        <h2>From conversation to first order</h2>
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
                heading="Become a manufacturing partner."
                copy="Tell us what you make and what you can produce. We'll tell you honestly if it's a fit."
                primary={{ label: common('become_partner', 'Become a Manufacturing Partner'), href: route('contact.partner') }}
            />
        </AppLayout>
    );
}
