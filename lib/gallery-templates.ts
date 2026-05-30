/**
 * Hardcoded gallery template dataset — Indonesian snack UMKM packaging styles.
 *
 * Frontend-only: no backend, no API. These entries drive the Gallery page grid,
 * search, filtering, sorting, pagination, the hover overlay, and the detail modal.
 *
 * Card/modal preview = a CSS gradient (gradientFrom → gradientTo) with a
 * per-packagingType silhouette on top (no images). Each template also carries:
 *   - styleTags    2–3 mood words (hover overlay + modal "Styles")
 *   - description  2–3 sentence creative brief (modal "Description")
 *   - colorPalette 4–6 decorative hex swatches (modal "Colors")
 *
 * Gradient pairs are decorative, chosen by flavor profile:
 *   warm cream → tan      #FBF3E2 → #D9B98A   traditional (keripik, rempeyek)
 *   sage → forest green   #A8B89A → #3F5E47   organic / herbal
 *   terra → red clay      #E0793C → #9E3621   spicy (kerupuk pedas, sambal roa)
 *   golden honey → amber  #F6C453 → #D98A28   sweet / classic (kue kering, bakpia)
 *   charcoal → graphite   #3A3A3A → #1C1C1C   premium / dark (oleh-oleh, kopi)
 *   soft rose → coral     #F4B9A6 → #E07A5F   fruit-based (manisan, pisang sale)
 */

export type GalleryPackagingType =
  | "standing-pouch"
  | "pillow-pouch"
  | "box"
  | "jar"
  | "bottle"
  | "sachet";

export type TemplateBadge = "popular" | "new";

export interface PackagingTemplate {
  id: string;
  name: string;
  packagingType: GalleryPackagingType;
  gradientFrom: string;
  gradientTo: string;
  styleTags: string[];
  description: string;
  colorPalette: string[];
  badge?: TemplateBadge;
  usageCount: number;
  createdAt: string;
}

/**
 * 14 snack-specific entries (2 pages at 12 per page).
 */
export const GALLERY_TEMPLATES: PackagingTemplate[] = [
  {
    id: "keripik-singkong-premium",
    name: "Keripik Singkong Premium",
    packagingType: "standing-pouch",
    gradientFrom: "#FBF3E2",
    gradientTo: "#D9B98A",
    styleTags: ["premium", "warm", "traditional"],
    description:
      "A warm, premium feel ideal for traditional cassava-based snacks. The amber tones and clean typography work especially well for oleh-oleh packaging targeted at gift-shop retail.",
    colorPalette: ["#FBF3E2", "#D9B98A", "#F6C453", "#9E6B1F", "#1A1A1A"],
    badge: "popular",
    usageCount: 1480,
    createdAt: "2026-01-12T09:00:00.000Z",
  },
  {
    id: "rempeyek-heritage",
    name: "Rempeyek Heritage",
    packagingType: "pillow-pouch",
    gradientFrom: "#FBF3E2",
    gradientTo: "#D9B98A",
    styleTags: ["traditional", "rustic", "warm"],
    description:
      "Heritage-inspired styling that celebrates the handmade character of rempeyek. Earthy cream and tan tones evoke an authentic, home-kitchen origin story for village-made snacks.",
    colorPalette: ["#FBF3E2", "#D9B98A", "#B98A4B", "#6B4A23"],
    badge: "popular",
    usageCount: 1320,
    createdAt: "2026-01-20T09:00:00.000Z",
  },
  {
    id: "kerupuk-pedas-bold",
    name: "Kerupuk Pedas Bold",
    packagingType: "standing-pouch",
    gradientFrom: "#E0793C",
    gradientTo: "#9E3621",
    styleTags: ["bold", "spicy", "vibrant"],
    description:
      "A high-energy, fiery look built for spicy crackers that need to shout from the shelf. Terra and red-clay tones signal heat while staying appetizing for younger snackers.",
    colorPalette: ["#E0793C", "#9E3621", "#F6C453", "#5E1B12"],
    badge: "new",
    usageCount: 640,
    createdAt: "2026-05-18T09:00:00.000Z",
  },
  {
    id: "kue-kering-lebaran",
    name: "Kue Kering Lebaran",
    packagingType: "jar",
    gradientFrom: "#F6C453",
    gradientTo: "#D98A28",
    styleTags: ["elegant", "premium", "warm"],
    description:
      "A festive, gift-ready aesthetic for Lebaran cookie jars. Golden honey tones and refined detailing make it a natural fit for seasonal hampers and premium retail gifting.",
    colorPalette: ["#F6C453", "#D98A28", "#FBF3E2", "#8A5A12"],
    badge: "popular",
    usageCount: 1255,
    createdAt: "2026-02-02T09:00:00.000Z",
  },
  {
    id: "kacang-garing-snack",
    name: "Kacang Garing Snack",
    packagingType: "pillow-pouch",
    gradientFrom: "#A8B89A",
    gradientTo: "#3F5E47",
    styleTags: ["organic", "minimal", "rustic"],
    description:
      "A natural, wholesome direction for roasted peanuts and nut snacks. Sage and forest-green tones lean into an organic, better-for-you positioning with calm, minimal typography.",
    colorPalette: ["#A8B89A", "#3F5E47", "#FBF3E2", "#23351F"],
    usageCount: 870,
    createdAt: "2026-02-15T09:00:00.000Z",
  },
  {
    id: "kerupuk-udang-klasik",
    name: "Kerupuk Udang Klasik",
    packagingType: "pillow-pouch",
    gradientFrom: "#FBF3E2",
    gradientTo: "#D9B98A",
    styleTags: ["traditional", "warm", "elegant"],
    description:
      "A timeless, classic feel for prawn crackers with broad family appeal. Warm cream tones and balanced layout suit both traditional markets and modern minimarket shelves.",
    colorPalette: ["#FBF3E2", "#D9B98A", "#E0793C", "#7A4A1F"],
    usageCount: 1090,
    createdAt: "2026-01-28T09:00:00.000Z",
  },
  {
    id: "oleh-oleh-premium-box",
    name: "Oleh-Oleh Premium Box",
    packagingType: "box",
    gradientFrom: "#3A3A3A",
    gradientTo: "#1C1C1C",
    styleTags: ["premium", "elegant", "modern"],
    description:
      "A sophisticated, dark-toned box design for premium souvenir assortments. Charcoal and graphite tones with restrained accents convey a high-end, giftable presentation.",
    colorPalette: ["#3A3A3A", "#1C1C1C", "#F6C453", "#9A9A9A"],
    badge: "popular",
    usageCount: 1410,
    createdAt: "2026-01-08T09:00:00.000Z",
  },
  {
    id: "pisang-sale-tradisional",
    name: "Pisang Sale Tradisional",
    packagingType: "standing-pouch",
    gradientFrom: "#F4B9A6",
    gradientTo: "#E07A5F",
    styleTags: ["warm", "playful", "rustic"],
    description:
      "A friendly, fruit-forward look for dried banana snacks. Soft rose and coral tones feel approachable and homemade, ideal for local UMKM brands building a loyal following.",
    colorPalette: ["#F4B9A6", "#E07A5F", "#FBF3E2", "#A84A35"],
    usageCount: 720,
    createdAt: "2026-03-04T09:00:00.000Z",
  },
  {
    id: "dodol-tradisional",
    name: "Dodol Tradisional",
    packagingType: "sachet",
    gradientFrom: "#FBF3E2",
    gradientTo: "#D9B98A",
    styleTags: ["traditional", "rustic", "warm"],
    description:
      "A heritage sachet style for individually wrapped dodol. Warm cream and tan tones reinforce the slow-cooked, traditional craft behind this beloved chewy treat.",
    colorPalette: ["#FBF3E2", "#D9B98A", "#8A5A2B", "#4A2F17"],
    usageCount: 560,
    createdAt: "2026-03-22T09:00:00.000Z",
  },
  {
    id: "bakpia-klasik",
    name: "Bakpia Klasik",
    packagingType: "box",
    gradientFrom: "#F6C453",
    gradientTo: "#D98A28",
    styleTags: ["classic", "elegant", "warm"],
    description:
      "A clean, classic box treatment for Yogyakarta-style bakpia. Golden honey tones and tidy typography make it equally at home in tourist gift shops and online stores.",
    colorPalette: ["#F6C453", "#D98A28", "#FBF3E2", "#7A5012"],
    badge: "new",
    usageCount: 480,
    createdAt: "2026-05-25T09:00:00.000Z",
  },
  {
    id: "sambal-roa-sachet",
    name: "Sambal Roa Sachet",
    packagingType: "sachet",
    gradientFrom: "#E0793C",
    gradientTo: "#9E3621",
    styleTags: ["bold", "spicy", "modern"],
    description:
      "A punchy sachet design for ready-to-use roa chili sauce. Terra and red-clay tones communicate bold, smoky heat while a modern layout keeps it shelf-ready for retail.",
    colorPalette: ["#E0793C", "#9E3621", "#1A1A1A", "#F6C453"],
    badge: "popular",
    usageCount: 1180,
    createdAt: "2026-02-11T09:00:00.000Z",
  },
  {
    id: "manisan-mangga",
    name: "Manisan Mangga",
    packagingType: "jar",
    gradientFrom: "#F4B9A6",
    gradientTo: "#E07A5F",
    styleTags: ["playful", "vibrant", "warm"],
    description:
      "A bright, fruity jar style for sweet mango candy. Soft rose-to-coral tones feel cheerful and fresh, appealing to younger buyers and casual gifting alike.",
    colorPalette: ["#F4B9A6", "#E07A5F", "#F6C453", "#A84A35"],
    usageCount: 930,
    createdAt: "2026-03-12T09:00:00.000Z",
  },
  {
    id: "madu-hutan-botol",
    name: "Madu Hutan Botol",
    packagingType: "bottle",
    gradientFrom: "#A8B89A",
    gradientTo: "#3F5E47",
    styleTags: ["organic", "premium", "rustic"],
    description:
      "An earthy, natural bottle design for wild forest honey. Sage and forest-green tones signal purity and provenance, supporting a premium, single-origin story.",
    colorPalette: ["#A8B89A", "#3F5E47", "#F6C453", "#23351F"],
    badge: "new",
    usageCount: 610,
    createdAt: "2026-05-10T09:00:00.000Z",
  },
  {
    id: "kopi-robusta-premium",
    name: "Kopi Robusta Premium",
    packagingType: "bottle",
    gradientFrom: "#3A3A3A",
    gradientTo: "#1C1C1C",
    styleTags: ["premium", "bold", "modern"],
    description:
      "A confident, dark bottle aesthetic for premium robusta coffee. Charcoal and graphite tones with a crisp modern layout convey depth, roast intensity, and specialty positioning.",
    colorPalette: ["#3A3A3A", "#1C1C1C", "#D98A28", "#9A9A9A"],
    usageCount: 1015,
    createdAt: "2026-02-26T09:00:00.000Z",
  },
];
