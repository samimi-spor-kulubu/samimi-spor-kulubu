import type {SVGProps} from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function strokeBase(props: IconProps): IconProps {
  return {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    ...props
  };
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...strokeBase(props)}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...strokeBase(props)}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...strokeBase({strokeWidth: 2.5, ...props})}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...strokeBase(props)}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...strokeBase(props)}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <polygon points="8 5 19 12 8 19 8 5" />
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <svg {...strokeBase(props)}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  );
}

export function AwardIcon(props: IconProps) {
  return (
    <svg {...strokeBase(props)}>
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 22 12 19 17 22 15.79 13.88" />
    </svg>
  );
}

export function LayersIcon(props: IconProps) {
  return (
    <svg {...strokeBase(props)}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...strokeBase(props)}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...strokeBase(props)}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...strokeBase(props)}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .18 5.32.18 11.88c0 2.09.55 4.13 1.6 5.93L0 24l6.34-1.66a11.86 11.86 0 0 0 5.72 1.46h.01c6.55 0 11.88-5.33 11.88-11.88a11.85 11.85 0 0 0-3.43-8.44ZM12.07 21.78h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.22-3.76.98 1-3.66-.24-.38a9.9 9.9 0 0 1-1.52-5.24c0-5.46 4.44-9.9 9.93-9.9 2.65 0 5.14 1.03 7.01 2.9a9.83 9.83 0 0 1 2.9 7.01c0 5.46-4.44 9.9-9.91 9.9Zm5.43-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01a1.1 1.1 0 0 0-.8.37c-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.11 3.22 5.11 4.52.71.31 1.27.49 1.7.63.71.23 1.36.2 1.88.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.3.17-1.41-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}
