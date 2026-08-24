import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props
});

export const SearchIcon = (p: P) => (<svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>);
export const BagIcon = (p: P) => (<svg {...base(p)}><path d="M6 7h12l1.2 13H4.8L6 7Z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /></svg>);
export const HeartIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base(p)} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9Z" />
  </svg>
);
export const UserIcon = (p: P) => (<svg {...base(p)}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>);
export const HomeIcon = (p: P) => (<svg {...base(p)}><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /></svg>);
export const MenuIcon = (p: P) => (<svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h10" /></svg>);
export const XIcon = (p: P) => (<svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>);
export const ChevronDownIcon = (p: P) => (<svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>);
export const ChevronLeftIcon = (p: P) => (<svg {...base(p)}><path d="m15 6-6 6 6 6" /></svg>);
export const ChevronRightIcon = (p: P) => (<svg {...base(p)}><path d="m9 6 6 6-6 6" /></svg>);
export const ArrowRightIcon = (p: P) => (<svg {...base(p)}><path d="M4 12h16" /><path d="m14 6 6 6-6 6" /></svg>);
export const StarIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base(p)} fill={filled ? "currentColor" : "none"} strokeWidth={1.2}>
    <path d="m12 3 2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.8 6.4 20l1.3-6.2L3 9.5l6.3-.7L12 3Z" />
  </svg>
);
export const TrashIcon = (p: P) => (<svg {...base(p)}><path d="M4 7h16" /><path d="M9 7V5h6v2" /><path d="M6.5 7 8 20h8l1.5-13" /><path d="M10 11v5M14 11v5" /></svg>);
export const PlusIcon = (p: P) => (<svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>);
export const MinusIcon = (p: P) => (<svg {...base(p)}><path d="M5 12h14" /></svg>);
export const CheckIcon = (p: P) => (<svg {...base(p)}><path d="m5 13 4 4L19 7" /></svg>);
export const TruckIcon = (p: P) => (<svg {...base(p)}><path d="M2 7h11v9H2zM13 10h4l3 3v3h-7z" /><circle cx="6.5" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></svg>);
export const GiftIcon = (p: P) => (<svg {...base(p)}><rect x="3" y="9" width="18" height="12" rx="1" /><path d="M12 9v12M3 13h18" /><path d="M12 9C9 9 7 7.8 7 6a2 2 0 0 1 4-.5c.4.9.8 2.3 1 3.5.2-1.2.6-2.6 1-3.5A2 2 0 0 1 17 6c0 1.8-2 3-5 3Z" /></svg>);
export const SparkleIcon = (p: P) => (<svg {...base(p)}><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="m6 6 2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" /></svg>);
export const InstagramIcon = (p: P) => (<svg {...base(p)}><rect x="3.5" y="3.5" width="17" height="17" rx="4.5" /><circle cx="12" cy="12" r="3.6" /><circle cx="17" cy="7" r="0.8" fill="currentColor" /></svg>);
export const FacebookIcon = (p: P) => (<svg {...base(p)}><path d="M14 8h2V5h-2a4 4 0 0 0-4 4v2H8v3h2v6h3v-6h2.4l.6-3H13V9a1 1 0 0 1 1-1Z" /></svg>);
export const TiktokIcon = (p: P) => (<svg {...base(p)}><path d="M14 4v9.5a3.75 3.75 0 1 1-3.2-3.7" /><path d="M14 5.5A4.5 4.5 0 0 0 18.5 9" /></svg>);
export const WhatsappIcon = (p: P) => (<svg {...base(p)}><path d="M4.5 19.5 5.8 16A7.5 7.5 0 1 1 9 18.6l-4.5.9Z" /><path d="M9.4 9c.2 2.6 2.4 4.9 5 5.3l.9-1.2 1.8.8-.3 1.4c-3 .6-7.3-2.7-7.8-5.7l1.4-.5.9 1.7-1.9-.2" /></svg>);
export const PhoneIcon = (p: P) => (<svg {...base(p)}><path d="M5 4h4l1.5 4L8 10a13 13 0 0 0 6 6l2-2.5 4 1.5v4a2 2 0 0 1-2.2 2A17.9 17.9 0 0 1 3 6.2 2 2 0 0 1 5 4Z" /></svg>);
export const MailIcon = (p: P) => (<svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>);
export const PinIcon = (p: P) => (<svg {...base(p)}><path d="M12 21s-6.5-5.5-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.5 12 21 12 21Z" /><circle cx="12" cy="10.5" r="2.3" /></svg>);
export const ClockIcon = (p: P) => (<svg {...base(p)}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>);
export const FilterIcon = (p: P) => (<svg {...base(p)}><path d="M4 6h16M7 12h10M10 18h4" /></svg>);
export const EyeIcon = (p: P) => (<svg {...base(p)}><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></svg>);
export const PackageIcon = (p: P) => (<svg {...base(p)}><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></svg>);
export const LogoutIcon = (p: P) => (<svg {...base(p)}><path d="M9 21H5a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 5 3h4" /><path d="m16 17 5-5-5-5M21 12H9" /></svg>);
export const EditIcon = (p: P) => (<svg {...base(p)}><path d="M4 20h4L20 8l-4-4L4 16v4Z" /><path d="m13.5 6.5 4 4" /></svg>);
export const CreditCardIcon = (p: P) => (<svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h4" /></svg>);
export const CopyIcon = (p: P) => (<svg {...base(p)}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a1 1 0 0 1 1-1h9" /></svg>);
