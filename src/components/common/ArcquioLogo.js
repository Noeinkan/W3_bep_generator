/**
 * ArcquioLogo — inline SVG logomark
 * Geometric arc + Q-tail motif: connects "Arc" (architecture/NeoArc) with the "q" in Arcquio.
 * Use className to control size and color (stroke inherits currentColor).
 */
const ArcquioLogo = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* Main arc — 270° circle open on the right, forming a bold C/Q body */}
    <path
      d="M17.2 6.8 A7.5 7.5 0 1 0 17.2 17.2"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Q-tail — short diagonal extending bottom-right from arc end */}
    <line
      x1="16.5" y1="17.2"
      x2="21" y2="21"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export default ArcquioLogo;
