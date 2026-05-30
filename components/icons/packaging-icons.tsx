/**
 * Shared packaging silhouette icons.
 *
 * Six distinct stroke-based SVGs (viewBox 0 0 24 24) so each packaging type is
 * visually distinguishable. All use `stroke="currentColor"`, so color is driven
 * by the surrounding text color; `strokeWidth` defaults to 1.5 and can be
 * overridden (e.g. 2 for larger renders against gradients).
 *
 * Used by the Generate page packaging-type selector (small) and the Gallery
 * template cards (large, white).
 */

export type PackagingIconProps = React.SVGProps<SVGSVGElement>;

function BaseSvg({
  strokeWidth = 1.5,
  children,
  ...props
}: PackagingIconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Vertical stand-up pouch with a top seal. */
export function StandingPouchIcon(props: PackagingIconProps) {
  return (
    <BaseSvg {...props}>
      <path d="M7 4h10a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
      <path d="M6 8h12" />
    </BaseSvg>
  );
}

/** Horizontal pillow pouch with crimped ends. */
export function PillowPouchIcon(props: PackagingIconProps) {
  return (
    <BaseSvg {...props}>
      <rect x="5" y="7" width="14" height="10" rx="1.5" />
      <path d="M8 7v10" />
      <path d="M16 7v10" />
    </BaseSvg>
  );
}

/** Isometric carton box. */
export function BoxIcon(props: PackagingIconProps) {
  return (
    <BaseSvg {...props}>
      <path d="M12 3 3 7.5v9L12 21l9-4.5v-9L12 3Z" />
      <path d="M3 7.5 12 12l9-4.5" />
      <path d="M12 12v9" />
    </BaseSvg>
  );
}

/** Jar with a lid. */
export function JarIcon(props: PackagingIconProps) {
  return (
    <BaseSvg {...props}>
      <rect x="7" y="3" width="10" height="3" rx="1" />
      <path d="M7.5 6h9a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H8.5a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1Z" />
    </BaseSvg>
  );
}

/** Bottle with a neck, cap, and label band. */
export function BottleIcon(props: PackagingIconProps) {
  return (
    <BaseSvg {...props}>
      <path d="M10 3h4v2.5l1.3 2A4 4 0 0 1 16 9.8V19a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V9.8a4 4 0 0 1 .7-2.3L10 5.5V3Z" />
      <path d="M9.5 13h5" />
    </BaseSvg>
  );
}

/** Flat single-serve sachet with a top seal and center seam. */
export function SachetIcon(props: PackagingIconProps) {
  return (
    <BaseSvg {...props}>
      <rect x="7" y="4" width="10" height="16" rx="1" />
      <path d="M7 8h10" />
      <path d="M12 8v12" />
    </BaseSvg>
  );
}

/** Map keyed by packaging type value for convenient lookup. */
export const PACKAGING_ICONS: Record<
  string,
  React.FC<PackagingIconProps>
> = {
  "standing-pouch": StandingPouchIcon,
  "pillow-pouch": PillowPouchIcon,
  box: BoxIcon,
  jar: JarIcon,
  bottle: BottleIcon,
  sachet: SachetIcon,
};
