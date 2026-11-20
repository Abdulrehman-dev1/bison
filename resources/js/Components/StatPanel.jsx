import { useTranslation } from '@/hooks/useTranslation';
import { Globe2, Layers, MapPin } from 'lucide-react';

const STATS = [
    { Icon: Layers, label: 'stat_1_label', copy: 'stat_1_copy', labelFallback: 'One point of contact', copyFallback: 'Sourcing, pricing, quality, and delivery, under one roof' },
    { Icon: Globe2, label: 'stat_2_label', copy: 'stat_2_copy', labelFallback: 'Leather, ranch, and more', copyFallback: 'Vetted makers in Mexico, with room for new categories' },
    { Icon: MapPin, label: 'stat_3_label', copy: 'stat_3_copy', labelFallback: 'In person, start to finish', copyFallback: 'In-person management for every manufacturing partnership' },
];

export default function StatPanel() {
    const t = useTranslation();
    const home = (key, fallback) => t(`pages.home.${key}`, fallback);

    return (
        <div className="bt-stat-panel bt-stat-panel-v2">
            <div className="bt-stat-panel-grid-v2">
                {STATS.map(({ Icon, label, copy, labelFallback, copyFallback }) => (
                    <div className="bt-stat-panel-cell-v2" key={label}>
                        <div className="bt-stat-panel-icon">
                            <Icon size={22} strokeWidth={1.75} />
                        </div>
                        <div className="bt-stat-panel-l-v2">{home(label, labelFallback)}</div>
                        <div className="bt-stat-panel-s-v2">{home(copy, copyFallback)}</div>
                    </div>
                ))}
            </div>
            <div className="bt-route-caption">
                <span>{home('stat_foot_1', 'Active cross-border corridor')}</span>
                <span>{home('stat_foot_2', 'Coordinated from supplier to delivery')}</span>
            </div>
        </div>
    );
}
