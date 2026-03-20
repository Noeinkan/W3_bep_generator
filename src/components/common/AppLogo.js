import BRAND from '../../config/brandConfig';

/**
 * AppLogo — inline SVG logomark
 * variant="light"  → white ring + indigo arc (for dark backgrounds: sidebar, footer, hero)
 * variant="dark"   → blue ring + indigo arc  (for light backgrounds: navbar on white)
 * Colors sourced from src/config/brandConfig.js
 */
const AppLogo = ({ className, variant = 'light' }) => {
  const { ring: ringColor, arch: archColor } = variant === 'light'
    ? BRAND.logo.light
    : BRAND.logo.dark;

  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      {/* Q-ring — bold circle ring */}
      <circle cx="50" cy="40" r="24" stroke={ringColor} strokeWidth="7.5" />
      {/* A-arch — wide arc crossing through the lower portion of the ring */}
      <path
        d="M 14 72 C 26 46, 74 46, 86 72"
        stroke={archColor}
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
};

export { AppLogo };
export default AppLogo;
