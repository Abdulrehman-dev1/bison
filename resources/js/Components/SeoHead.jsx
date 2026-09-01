import { Head, usePage } from '@inertiajs/react';

export default function SeoHead({ seo = {}, schemas = [] }) {
    const { url } = usePage();
    const title = seo.title ?? 'Bison TradeWorks';
    const description = seo.description ?? '';
    const canonical = seo.canonical ?? url;
    const image = seo.image ?? null;

    return (
        <Head>
            <title>{title}</title>
            {description && <meta head-key="description" name="description" content={description} />}
            <link head-key="canonical" rel="canonical" href={canonical} />
            <meta head-key="og:title" property="og:title" content={title} />
            {description && (
                <meta head-key="og:description" property="og:description" content={description} />
            )}
            <meta head-key="og:url" property="og:url" content={canonical} />
            <meta head-key="og:type" property="og:type" content="website" />
            {image && <meta head-key="og:image" property="og:image" content={image} />}
            <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
            <meta head-key="twitter:title" name="twitter:title" content={title} />
            {description && (
                <meta head-key="twitter:description" name="twitter:description" content={description} />
            )}
            {image && <meta head-key="twitter:image" name="twitter:image" content={image} />}
            {schemas.map((schema, index) => (
                <script
                    key={`schema-${index}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
        </Head>
    );
}
