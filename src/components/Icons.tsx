import type { SVGProps } from "react";

type IconName = "water" | "air" | "home" | "phone" | "arrow" | "shield" | "doc" | "download";

const paths: Record<IconName, React.ReactNode> = {
  water: (
    <path
      d="M12 2.5S5 10 5 14.5a7 7 0 0 0 14 0C19 10 12 2.5 12 2.5Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  ),
  air: (
    <>
      <path d="M3 9h11a3 3 0 1 0-3-3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M3 13h15a3 3 0 1 1-3 3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M3 17h8a2.5 2.5 0 1 1-2.5 2.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
  home: (
    <path
      d="M4 11.5 12 5l8 6.5M6 10.5V19h12v-8.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  ),
  phone: (
    <path
      d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z"
      fill="currentColor"
    />
  ),
  arrow: (
    <path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  ),
  shield: (
    <path
      d="M12 3 5 6v6c0 4 3 6.5 7 9 4-2.5 7-5 7-9V6l-7-3Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  ),
  doc: (
    <path
      d="M6 3h7l5 5v13H6V3Zm7 0v5h5M9 13h6M9 17h6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  ),
  download: (
    <path
      d="M12 3v11m0 0 4-4m-4 4-4-4M5 19h14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden {...props}>
      {paths[name]}
    </svg>
  );
}
