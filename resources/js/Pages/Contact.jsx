import AppLayout from '@/Components/Layout/AppLayout';
import SeoHead from '@/Components/SeoHead';
import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

const INTENT_COPY = {
    partner: {
        h1: 'Tell us about your manufacturing capability.',
        dek: "Share what you produce and your capacity, and we'll tell you honestly if it's a fit, then handle the buyer relationship from there.",
        label: "What do you produce, and what's your capacity?",
        placeholder: 'e.g. what you produce, capacity per month',
    },
    request: {
        h1: 'Tell us what you need to order.',
        dek: "Share what you're looking for, and we'll quote it. Sourced, delivered, one point of contact throughout.",
        label: 'What do you need?',
        placeholder: 'e.g. product type, ~500 units/month',
    },
    general: {
        h1: 'Get in touch.',
        dek: "Whether you're ordering, stocking, or supplying goods, exploring a new category, or just have a question, tell us what you need and we'll take it from there.",
        label: 'How can we help?',
        placeholder: 'e.g. sourcing, stocking, supplying, or something else',
    },
};

export default function Contact({ seo, schemas, intent = 'general' }) {
    const { translations, flash } = usePage().props;
    const common = translations?.common ?? {};
    const pages = translations?.pages ?? {};
    const copy = pages?.contact?.[intent] ?? pages?.contact?.general ?? INTENT_COPY[intent] ?? INTENT_COPY.general;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        company: '',
        detail: '',
        intent,
    });

    const submitted = Boolean(flash?.success);

    const submit = (event) => {
        event.preventDefault();
        post(route('contact.store'), {
            preserveScroll: true,
            onSuccess: () => reset('name', 'email', 'company', 'detail'),
        });
    };

    return (
        <AppLayout>
            <SeoHead seo={seo} schemas={schemas} />

            <section className="bt-page-hero">
                <div className="bt-wrap">
                    <h1 className="bt-h1-page">{copy.h1}</h1>
                    <p className="bt-hero-dek">{copy.dek}</p>
                </div>
            </section>

            <section>
                <div className="bt-wrap bt-contact-grid">
                    <form className="bt-form" onSubmit={submit}>
                        {submitted ? (
                            <div className="bt-form-success">
                                <h3>{common.form_success_title ?? 'Request received.'}</h3>
                                <p>{common.form_success_body ?? 'Someone from our team will reply within one business day.'}</p>
                            </div>
                        ) : (
                            <>
                                <label>
                                    {common.name ?? 'Name'}
                                    <input
                                        required
                                        type="text"
                                        value={data.name}
                                        onChange={(event) => setData('name', event.target.value)}
                                        placeholder="Jordan Ramirez"
                                    />
                                    {errors.name && <span className="bt-form-error">{errors.name}</span>}
                                </label>
                                <label>
                                    {common.email ?? 'Work email'}
                                    <input
                                        required
                                        type="email"
                                        value={data.email}
                                        onChange={(event) => setData('email', event.target.value)}
                                        placeholder="jordan@yourbrand.com"
                                    />
                                    {errors.email && <span className="bt-form-error">{errors.email}</span>}
                                </label>
                                <label>
                                    {common.company ?? 'Company'}
                                    <input
                                        type="text"
                                        value={data.company}
                                        onChange={(event) => setData('company', event.target.value)}
                                        placeholder="Your brand"
                                    />
                                    {errors.company && <span className="bt-form-error">{errors.company}</span>}
                                </label>
                                <label>
                                    {copy.label}
                                    <textarea
                                        required
                                        rows={5}
                                        value={data.detail}
                                        onChange={(event) => setData('detail', event.target.value)}
                                        placeholder={copy.placeholder}
                                    />
                                    {errors.detail && <span className="bt-form-error">{errors.detail}</span>}
                                </label>
                                <button
                                    type="submit"
                                    className="bt-btn bt-btn-solid bt-form-submit"
                                    disabled={processing}
                                >
                                    {common.send_request ?? 'Send Request'} <ArrowRight size={16} />
                                </button>
                            </>
                        )}
                    </form>

                    <div className="bt-contact-info">
                        <div className="bt-info-block">
                            <h4>{common.reach_us ?? 'Reach us'}</h4>
                            <a href="mailto:contact@bisontradeworks.com">contact@bisontradeworks.com</a>
                            <a href="tel:+19787602805">(978) 760-2805</a>
                        </div>
                        <div className="bt-info-block">
                            <h4>{common.office ?? 'Office'}</h4>
                            <span>{common.office_value ?? 'Texas, US · Guanajuato, MX'}</span>
                        </div>
                        <div className="bt-info-block">
                            <h4>{common.response_time ?? 'Response time'}</h4>
                            <span>{common.response_time_value ?? 'Typically within one business day.'}</span>
                        </div>
                        <Link href={route('contact.request')} className="bt-link-cta">
                            Need a quote instead?
                        </Link>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
