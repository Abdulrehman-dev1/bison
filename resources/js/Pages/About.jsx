import AppLayout from '@/Components/Layout/AppLayout';
import CtaBand from '@/Components/CtaBand';
import Eyebrow from '@/Components/Eyebrow';
import SeoHead from '@/Components/SeoHead';
import { useTranslation } from '@/hooks/useTranslation';
import { Compass, MessagesSquare, RotateCcw } from 'lucide-react';

export default function About({ seo, schemas }) {
    const t = useTranslation();
    const page = (key, fallback = '') => t(`pages.about.${key}`, fallback);
    const common = (key, fallback = '') => t(`common.${key}`, fallback);

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
                <div className="bt-wrap bt-story-grid">
                    <div className="bt-story-photo">
                        <span>Photo placeholder — León, Mexico</span>
                    </div>
                    <div className="bt-story-copy">
                        <Eyebrow>Our Story</Eyebrow>
                        <h2>Why we exist</h2>
                        <p className="bt-story-note">
                            Manufacturers rarely have a direct, trustworthy path to buyers
                            on the other side of a border, and buyers rarely have a
                            reliable way to vet a factory they&apos;ve never set foot in. Bison
                            TradeWorks exists in that gap, representing both sides
                            properly instead of leaving either one guessing.
                        </p>
                        <p className="bt-story-note">
                            We work with manufacturers in León, Mexico, a region known for
                            serious craftsmanship that most outside buyers never see
                            firsthand, and we want to help them reach buyers who&apos;d
                            otherwise never find them, building something real in the
                            process. Every relationship runs in both English and Spanish,
                            so nothing gets lost between buyer and manufacturer.
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <div className="bt-wrap">
                    <div className="bt-sec-head">
                        <Eyebrow>How We Work</Eyebrow>
                        <h2>One vetted relationship at a time</h2>
                        <p>We&apos;re not building a directory of manufacturers we&apos;ve never met. Every partner joins our network only after we&apos;ve visited the floor in person, and we&apos;re meeting new ones every week.</p>
                    </div>
                    <div className="bt-card-grid">
                        <div className="bt-card">
                            <div className="bt-ico">
                                <Compass size={22} strokeWidth={1.75} />
                            </div>
                            <h3>We vet before we buy</h3>
                            <p>Every manufacturing partner we work with has been vetted in person, not just certified on paper.</p>
                        </div>
                        <div className="bt-card">
                            <div className="bt-ico">
                                <MessagesSquare size={22} strokeWidth={1.75} />
                            </div>
                            <h3>We own the negotiation</h3>
                            <p>Pricing and terms are handled by us, directly with the manufacturer. You get clear pricing, not a cross-border negotiation.</p>
                        </div>
                        <div className="bt-card">
                            <div className="bt-ico">
                                <RotateCcw size={22} strokeWidth={1.75} />
                            </div>
                            <h3>We stay accountable after delivery</h3>
                            <p>We stay involved after delivery, tracking quality and consistency so the relationship keeps working for you, order after order.</p>
                        </div>
                    </div>
                </div>
            </section>

            <CtaBand
                heading="Start a conversation."
                copy="A short call is enough to know if we're the right fit for what you need."
                primary={{ label: common('get_in_touch', 'Get in Touch'), href: route('contact') }}
            />
        </AppLayout>
    );
}
