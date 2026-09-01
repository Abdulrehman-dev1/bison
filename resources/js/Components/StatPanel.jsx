import { Layers, Globe2, MapPin } from 'lucide-react';

const stats = [
    {
        Icon: Layers,
        label: 'One point of contact',
        sub: 'Sourcing, pricing, quality, and delivery, under one roof',
    },
    {
        Icon: Globe2,
        label: 'Any category, done right',
        sub: 'The same process, applied wherever the work takes us',
    },
    {
        Icon: MapPin,
        label: 'In person, start to finish',
        sub: 'In-person management for every manufacturing partnership',
    },
];

export default function StatPanel() {
    return (
        <div className="bt-stat-panel bt-stat-panel-v2">
            <div className="bt-stat-panel-grid-v2">
                {stats.map(({ Icon, label, sub }) => (
                    <div className="bt-stat-panel-cell-v2" key={label}>
                        <div className="bt-stat-panel-icon">
                            <Icon size={22} strokeWidth={1.75} />
                        </div>
                        <div className="bt-stat-panel-l-v2">{label}</div>
                        <div className="bt-stat-panel-s-v2">{sub}</div>
                    </div>
                ))}
            </div>
            <div className="bt-route-caption">
                <span>Active cross-border corridor</span>
                <span>Coordinated from supplier to delivery</span>
            </div>
        </div>
    );
}
