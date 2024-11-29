export default function MoinSvg({ size = 24, className = "" }) {
    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            className={`fill-current ${className}`}
            aria-hidden="true"
        >
            <path d="M6 12c0-.55.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1H7c-.55 0-1-.45-1-1z" />
        </svg>
    );
}
