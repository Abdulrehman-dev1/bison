import {
    Package,
    Factory,
    Receipt,
    Truck,
    ShieldCheck,
    Repeat2,
} from 'lucide-react';

export const SERVICE_DETAILS = [
    {
        Icon: Package,
        title: 'Sourced Goods',
        copy: "You order from us directly, and we manage production, quality, and freight behind the scenes, so you're not chasing multiple vendors for one product.",
        bullets: [
            'Start to finish, no handoff to the manufacturer',
            'Pricing, quality, and delivery are on us',
            'One billing relationship',
        ],
    },
    {
        Icon: Factory,
        title: 'Vetted Production',
        copy: "We work with a growing set of manufacturing partners in León. Vetting isn't a one-time check, and neither is the relationship. We stay on the floor as production continues, and manage the relationship in person after that.",
        bullets: [
            'Every partner vetted and managed in person, not by phone',
            'Capacity confirmed up front, consistency checked on every run',
            'New partners added every week, each held to the same bar',
        ],
    },
    {
        Icon: Receipt,
        title: 'Pricing You Can Rely On',
        copy: 'We negotiate pricing and terms directly with our manufacturing partners, so you get clear pricing instead of managing a cross-border negotiation yourself.',
        bullets: [
            'Market-rate pricing, quoted clearly upfront',
            'Pay in USD or CAD',
            'Factory negotiation and terms handled on your behalf',
        ],
    },
    {
        Icon: Truck,
        title: 'Import & Freight Coordination',
        copy: 'We match the shipping method to the order. Parcel carriers for a single sample or small run, full truckload freight for volume. We coordinate customs clearance directly so nothing sits at the border.',
        bullets: [
            'Right-sized shipping, from one item to a full truckload',
            'Customs clearance coordinated as part of every shipment',
            'Status updates from pickup to delivery',
        ],
    },
    {
        Icon: ShieldCheck,
        title: 'Quality Control',
        copy: "We inspect production before it ships, so quality issues get caught on our end, not after it lands on your dock.",
        bullets: [
            'Pre-shipment inspection against your spec',
            'Issues resolved with the manufacturer directly',
            "You're never negotiating a defect claim cross-border",
        ],
    },
    {
        Icon: Repeat2,
        title: 'Ongoing Account Management',
        copy: "The relationship doesn't end at the first order. We stay the point of contact on both ends, order after order.",
        bullets: [
            'Consistent contact for supplier and delivery',
            'Support resolving delays or quality issues',
            'One point of contact, even as your orders grow',
        ],
    },
];
