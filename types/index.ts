export const ORDER_STATUSES = [
  "PENDING",
  "PAYMENT_PENDING",
  "PAID",
  "PROCESSING",
  "PACKAGING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED"
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "Order Received",
  PAYMENT_PENDING: "Awaiting Payment",
  PAID: "Payment Confirmed",
  PROCESSING: "Preparing Your Gift",
  PACKAGING: "Beautifully Packaged",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded"
};

export const TIMELINE_STEPS: OrderStatus[] = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "PACKAGING",
  "OUT_FOR_DELIVERY",
  "DELIVERED"
];

export const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"] as const;

export const RECIPIENTS = [
  { slug: "her", name: "For Her" },
  { slug: "him", name: "For Him" },
  { slug: "mum", name: "For Mum" },
  { slug: "dad", name: "For Dad" },
  { slug: "friends", name: "For Friends" },
  { slug: "couples", name: "For Couples" }
] as const;

export const PRICE_BUCKETS = [
  { key: "u1000", label: "Under KSh 1,000", min: 0, max: 999 },
  { key: "1000-2500", label: "KSh 1,000 – 2,500", min: 1000, max: 2500 },
  { key: "2500-5000", label: "KSh 2,500 – 5,000", min: 2501, max: 5000 },
  { key: "o5000", label: "KSh 5,000+", min: 5001, max: 10_000_000 }
] as const;

export const FEELINGS = [
  { slug: "love", title: "Love", line: "For the people who make your heart happy.", tag: "love" },
  { slug: "celebrate", title: "Celebrate", line: "For life's beautiful milestones.", tag: "celebrate" },
  { slug: "thank-you", title: "Thank You", line: "For showing appreciation.", tag: "appreciation" },
  { slug: "just-because", title: "Just Because", line: "Because sometimes there doesn't need to be a reason.", tag: "just because" },
  { slug: "self-love", title: "Self Love", line: "A beautiful gift for yourself.", tag: "self love" },
  { slug: "thinking-of-you", title: "Thinking Of You", line: "A little reminder that someone cares.", tag: "thinking of you" }
];

export const GIFT_BOX_SIZES = [
  { id: "small", name: "Small", desc: "Up to 2 treasures", capacity: 2 },
  { id: "medium", name: "Medium", desc: "Up to 3 treasures", capacity: 3 },
  { id: "large", name: "Large", desc: "Up to 4 treasures", capacity: 4 },
  { id: "premium", name: "Premium", desc: "Up to 6 treasures", capacity: 6 }
];

export const RIBBONS = ["Champagne Satin", "Ivory Silk", "Deep Black", "Blush Rose"];

export type CartLine = {
  key: string;
  type: "product" | "giftBox";
  productId?: string;
  giftBoxId?: string;
  slug?: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  stock: number;
  variant?: string;
  personalization?: Record<string, string>;
  meta?: string[];
};

export type SavedLine = CartLine & { savedAt: number };

export type WishlistEntry = {
  slug: string;
  name: string;
  image: string;
  price: number;
  stock: number;
};

export type ProductCardData = {
  slug: string;
  name: string;
  shortDesc: string;
  image: string;
  price: number;
  compareAtPrice: number | null;
  isNew: boolean;
  isBestSeller: boolean;
  personalizable: boolean;
  rating: number | null;
  reviewCount: number;
  stock: number;
};
