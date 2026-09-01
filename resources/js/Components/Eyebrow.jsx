export default function Eyebrow({ children, light = false }) {
    return (
        <div className={`bt-eyebrow ${light ? 'bt-eyebrow-light' : ''}`}>{children}</div>
    );
}
