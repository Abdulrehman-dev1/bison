import { usePage } from '@inertiajs/react';

export function useTranslation() {
    const { translations } = usePage().props;

    return function t(path, fallback = '') {
        const parts = path.split('.');
        let value = translations;

        for (const part of parts) {
            if (value == null) {
                return fallback;
            }
            value = value[part];
        }

        if (value == null || value === '') {
            return fallback;
        }

        return value;
    };
}

export function useTranslations() {
    const { translations } = usePage().props;
    return translations ?? {};
}
