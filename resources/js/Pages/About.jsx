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
                        <span>{page('photo_label', 'Photo placeholder — León, Mexico')}</span>
                    </div>
                    <div className="bt-story-copy">
                        <Eyebrow>{page('story_eyebrow', 'Our story')}</Eyebrow>
                        <h2>{page('story_title', 'Why we exist')}</h2>
                        <p className="bt-story-note">{page('story_p1')}</p>
                        <p className="bt-story-note">{page('story_p2')}</p>
                    </div>
                </div>
            </section>

            <section>
                <div className="bt-wrap">
                    <div className="bt-sec-head">
                        <Eyebrow>{page('how_eyebrow', 'How we work')}</Eyebrow>
                        <h2>{page('how_title', 'One vetted relationship at a time')}</h2>
                        <p>{page('how_dek')}</p>
                    </div>
                    <div className="bt-card-grid">
                        <div className="bt-card">
                            <div className="bt-ico">
                                <Compass size={22} strokeWidth={1.75} />
                            </div>
                            <h3>{page('vet_title', 'We vet before we buy')}</h3>
                            <p>{page('vet_copy')}</p>
                        </div>
                        <div className="bt-card">
                            <div className="bt-ico">
                                <MessagesSquare size={22} strokeWidth={1.75} />
                            </div>
                            <h3>{page('negotiate_title', 'We own the negotiation')}</h3>
                            <p>{page('negotiate_copy')}</p>
                        </div>
                        <div className="bt-card">
                            <div className="bt-ico">
                                <RotateCcw size={22} strokeWidth={1.75} />
                            </div>
                            <h3>{page('after_title', 'We stay accountable after delivery')}</h3>
                            <p>{page('after_copy')}</p>
                        </div>
                    </div>
                </div>
            </section>

            <CtaBand
                heading={page('cta_heading', 'Start a conversation.')}
                copy={page('cta_copy', "A short call is enough to know if we're the right fit for what you need.")}
                primary={{ label: common('get_in_touch', 'Get in Touch'), href: route('contact') }}
            />
        </AppLayout>
    );
}
