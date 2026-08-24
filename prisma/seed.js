const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

const db = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

const categories = [
  ["gift-boxes", "Gift Boxes"],
  ["candles", "Candles"],
  ["mugs", "Mugs"],
  ["tumblers", "Tumblers"],
  ["flowers", "Flowers"],
  ["jewelry", "Jewelry"],
  ["self-care", "Self Care"],
  ["home", "Home"],
  ["personalized", "Personalized Gifts"]
];

const collections = [
  ["talis-signature", "Talis Signature", "Premium curated gift boxes.", "/images/col-signature.svg", true],
  ["talis-moments", "Talis Moments", "Gifts for important occasions.", "/images/col-moments.svg", true],
  ["talis-personal", "Talis Personal", "Customized gifts, made for one person only.", "/images/col-personal.svg", true],
  ["talis-home", "Talis Home", "Candles, décor and lifestyle pieces.", "/images/col-home.svg", true]
];

const occasions = [
  ["birthday", "Birthday", "Make their day unforgettable."],
  ["anniversary", "Anniversary", "Celebrate the love you have built."],
  ["graduation", "Graduation", "Honour the hours behind the honours."],
  ["wedding", "Wedding", "For forever beginnings."],
  ["baby-shower", "Baby Shower", "Welcome the tiniest blessing."],
  ["appreciation", "Appreciation", "Say thank you beautifully."],
  ["valentines", "Valentine's", "Love, eloquently given."],
  ["christmas", "Christmas", "Warmth, wrapped in ribbon."],
  ["housewarming", "Housewarming", "Bless the new nest."],
  ["just-because", "Just Because", "No reason needed."]
];

function inv(qty) {
  return { create: { quantity: qty, reserved: 0 } };
}

const products = [
  {
    slug: "talis-signature-box", name: "Talis Signature Box", category: "gift-boxes",
    price: 4500, compareAt: null, stock: 12,
    short: "Our iconic curated box. Black, gold and unforgettable.",
    desc: "The box that started it all. A hand-packed selection of our most-loved treasures — a scented candle, artisan chocolate, a keepsake candle holder and a handwritten card — nestled in ivory tissue and finished with a champagne satin bow.\n\nEvery Signature Box is packed to order in Nairobi and arrives gift-ready. No wrapping paper required.",
    included: "Talis scented mini candle\nArtisan dark chocolate bar\nGold-dipped tea light holder\nHandwritten Talis card\nSignature black keepsake box",
    images: ["/images/box.svg", "/images/box-open.svg", "/images/packaging.svg"],
    occasions: ["anniversary", "birthday", "just-because"], recipients: "her,couples,friends",
    collections: ["talis-signature", "talis-moments"], tags: "signature,best,gift box,luxury",
    bestSeller: true, featured: true
  },
  {
    slug: "golden-moments-box", name: "Golden Moments Box", category: "gift-boxes",
    price: 6500, compareAt: 7200, stock: 8,
    short: "Our grandest gesture. Gold-wrapped indulgence.",
    desc: "For moments that deserve more than words. The Golden Moments Box layers premium treats with golden accents — a large soy candle, truffle selection, engraved keepsake and sparkling detail work.\n\nPresented in our large matte-black box with gold foil interior.",
    included: "Large Talis soy candle\nTruffle selection (9pc)\nEngraved gold keepsake plate\nChampagne satin ribbon\nHandwritten card",
    images: ["/images/box-open.svg", "/images/box.svg", "/images/packaging.svg"],
    occasions: ["anniversary", "wedding", "christmas"], recipients: "her,couples,mum",
    collections: ["talis-signature"], tags: "premium,gold,luxury,gift box",
    bestSeller: true, featured: true
  },
  {
    slug: "love-notes-gift-set", name: "Love Notes Gift Set", category: "gift-boxes",
    price: 3800, compareAt: null, stock: 10,
    short: "Roses, a candle and space for your own words.",
    desc: "A quiet, romantic set built around your words. Preserved rose petals, a rose-amber candle and a small notebook await your handwriting.\n\nPersonalize it with their name on the box label.",
    included: "Rose Amber mini candle\nPreserved rose petals vial\nMini linen notebook\nHandwritten card",
    images: ["/images/box.svg", "/images/flowers.svg", "/images/candle.svg"],
    occasions: ["valentines", "anniversary"], recipients: "her,couples",
    collections: ["talis-signature"], tags: "love,valentines,romance",
    personalizable: true, pFields: [{ label: "Name on label", max: 20 }, { label: "Short message", max: 120 }]
  },
  {
    slug: "self-love-box", name: "Self Love Box", category: "self-care",
    price: 4200, compareAt: null, stock: 14,
    short: "A beautiful gift for yourself. You deserve it.",
    desc: "Because the longest relationship you'll ever have is with yourself. A silk sleep set, bath soak, scented candle and journal — an evening of intentional rest.",
    included: "Ivory silk sleep set\nBotanical bath soak\nVanilla Noir candle\nGratitude mini-journal",
    images: ["/images/selfcare.svg", "/images/candle.svg", "/images/journal.svg"],
    occasions: ["just-because", "birthday"], recipients: "her,friends",
    collections: ["talis-home"], tags: "self love,self care,relax",
    isNew: true, featured: true
  },
  {
    slug: "celebration-box", name: "Celebration Box", category: "gift-boxes",
    price: 5500, compareAt: null, stock: 9,
    short: "Confetti-level joy for milestone moments.",
    desc: "Graduations, promotions, new homes — moments this big deserve a box this full. A luxe tumbler, gourmet treats, celebration candle and gold details.",
    included: "Luxe gold-rim tumbler\nGourmet snack selection\nCelebration candle\nGold confetti & card",
    images: ["/images/box-open.svg", "/images/tumbler.svg", "/images/box.svg"],
    occasions: ["graduation", "birthday"], recipients: "him,her,friends",
    collections: ["talis-moments"], tags: "graduation,congratulations,milestone",
    bestSeller: true
  },
  {
    slug: "little-moments-box", name: "Little Moments Box", category: "gift-boxes",
    price: 2900, compareAt: null, stock: 15,
    short: "Small box, enormous feeling.",
    desc: "Our petite box for little gestures that land big. A mini candle, artisan chocolate and a single preserved bloom.",
    included: "Mini Talis candle\nArtisan chocolate bar\nSingle preserved bloom\nCard",
    images: ["/images/packaging.svg", "/images/box.svg"],
    occasions: ["just-because", "baby-shower", "appreciation"], recipients: "friends,her",
    collections: ["talis-moments"], tags: "small gift,thinking of you",
    isNew: true
  },
  {
    slug: "corporate-appreciation-hamper", name: "Corporate Appreciation Hamper", category: "gift-boxes",
    price: 7500, compareAt: null, stock: 6,
    short: "Client gifts that close chapters beautifully.",
    desc: "Built for boardrooms and end-of-year gratitude. Premium treats, a branded-quality tumbler, desk candle and your company note, elegantly printed.",
    included: "Desk soy candle\nInsulated tumbler\nGourmet selection\nPrinted corporate card",
    images: ["/images/hamper.svg", "/images/box-open.svg"],
    occasions: ["appreciation", "christmas"], recipients: "him,her",
    collections: ["talis-signature", "talis-moments"], tags: "corporate,clients,thank you",
    featured: true, personalizable: true, pFields: [{ label: "Company / recipient name", max: 40 }]
  },
  {
    slug: "christmas-glow-box", name: "Christmas Glow Box", category: "gift-boxes",
    price: 5200, compareAt: null, stock: 11,
    short: "Warmth, wrapped in ribbon.",
    desc: "Cinnamon and clove candle, spiced treats, a velvet ribbon and everything merry. Limited festive release each December.",
    included: "Spiced Christmas candle\nFestive treat selection\nVelvet ribbon bundle\nCard",
    images: ["/images/box.svg", "/images/candle.svg", "/images/packaging.svg"],
    occasions: ["christmas"], recipients: "family" , collections: ["talis-moments"], tags: "christmas,festive,holiday"
  },
  {
    slug: "serenity-candle-duo", name: "Serenity Candle Duo", category: "candles",
    price: 2800, compareAt: null, stock: 18,
    short: "Two candles. One very calm room.",
    desc: "Vanilla Noir and Rose Amber, together. Our two signature scents poured into reusable amber glass vessels with cotton wicks and a 40-hour burn each.",
    included: "Vanilla Noir candle 220g\nRose Amber candle 220g\nGift sleeve",
    images: ["/images/candle.svg", "/images/home.svg"],
    occasions: ["just-because", "appreciation"], recipients: "her,friends",
    collections: ["talis-home"], tags: "candles,set,calm",
    featured: true
  },
  {
    slug: "talis-candle-vanilla-noir", name: "Talis Candle — Vanilla Noir", category: "candles",
    price: 1500, compareAt: null, stock: 30,
    short: "Dark vanilla, warm amber, 40 quiet hours.",
    desc: "Our best-selling scent. Madagascar vanilla folded into smoked amber and a whisper of sandalwood. Hand-poured in Nairobi into a reusable amber glass.",
    included: "Soy wax candle 220g\nCotton wick\n40-hour burn",
    images: ["/images/candle.svg"],
    occasions: ["just-because", "birthday"], recipients: "her,him,friends",
    collections: ["talis-home"], tags: "candle,vanilla,bestseller",
    bestSeller: true
  },
  {
    slug: "talis-candle-rose-amber", name: "Talis Candle — Rose Amber", category: "candles",
    price: 1500, compareAt: null, stock: 26,
    short: "Damask rose softened with warm amber.",
    desc: "Fresh-cut Damask rose over a base of amber and musk. Romantic without trying too hard. Hand-poured soy wax, 40-hour burn.",
    included: "Soy wax candle 220g\nCotton wick\n40-hour burn",
    images: ["/images/candle.svg", "/images/home.svg"],
    occasions: ["valentines", "anniversary"], recipients: "her,couples",
    collections: ["talis-home"], tags: "candle,rose"
  },
  {
    slug: "personalized-mug", name: "Personalized Mug", category: "personalized",
    price: 1200, compareAt: 1400, stock: 25,
    short: "Their name. Your words. Every morning.",
    desc: "A generous bone-china mug, printed in-house with a name on one side and your message on the other. Dishwasher-safe finish.\n\nAdd up to two lines of personalization at checkout.",
    included: "350ml bone china mug\nName print\nMessage print\nGift boxed",
    images: ["/images/mug.svg", "/images/frame.svg"],
    occasions: ["birthday", "just-because", "appreciation"], recipients: "her,him,mum,dad,friends",
    collections: ["talis-personal"], tags: "mug,name,custom,personalized",
    personalizable: true, pFields: [{ label: "Name", max: 18 }, { label: "Message (back)", max: 60 }],
    bestSeller: true, featured: true
  },
  {
    slug: "gold-initial-mug", name: "Gold Initial Mug", category: "mugs",
    price: 1350, compareAt: null, stock: 20,
    short: "One gold letter says plenty.",
    desc: "Matte ivory stoneware crowned with a 22k-gold-effect initial, applied by hand. A quiet luxury for desks and kitchen shelves alike.",
    included: "320ml stoneware mug\nGold-effect initial\nGift boxed",
    images: ["/images/mug.svg"],
    occasions: ["birthday", "wedding"], recipients: "her,him,couples",
    collections: ["talis-personal", "talis-home"], tags: "mug,initial,monogram",
    personalizable: true, pFields: [{ label: "Initial", max: 1 }]
  },
  {
    slug: "luxe-tumbler", name: "Luxe Tumbler", category: "tumblers",
    price: 2500, compareAt: null, stock: 22,
    short: "Keeps coffee hot through the longest Monday.",
    desc: "Double-wall vacuum-insulated stainless tumbler in brushed champagne gold. 400ml, spill-resistant lid, holds temperature up to 6 hours.\n\nOptional free engraving — add a name or date.",
    included: "400ml insulated tumbler\nSpill-resistant lid\nGift pouch",
    images: ["/images/tumbler.svg"],
    occasions: ["graduation", "birthday"], recipients: "him,her,friends",
    collections: ["talis-personal", "talis-home"], tags: "tumbler,insulated,engrave",
    isNew: true, personalizable: true, pFields: [{ label: "Engraving (optional)", max: 24 }]
  },
  {
    slug: "blush-peony-bouquet", name: "Blush Peony Bouquet", category: "flowers",
    price: 3200, compareAt: null, stock: 10,
    short: "Ten stems of blush, tied with silk.",
    desc: "Fresh blush peonies and spray roses, hand-tied in Nairobi and wrapped in ivory paper with a champagne silk ribbon. Delivered in our flower box with water source.",
    included: "10 fresh stems\nSilk ribbon wrap\nWater source box\nCard",
    images: ["/images/flowers.svg", "/images/packaging.svg"],
    occasions: ["anniversary", "valentines", "birthday"], recipients: "her,mum",
    collections: ["talis-moments"], tags: "flowers,peonies,fresh"
  },
  {
    slug: "eternal-rose-dome", name: "Eternal Rose Dome", category: "flowers",
    price: 4800, compareAt: null, stock: 7,
    short: "A rose that lasts a full year.",
    desc: "A single preserved Ecuadorian rose under a glass dome, on a gold base. Lasts up to twelve months with zero water. The anniversary gift that refuses to wilt.",
    included: "Preserved rose\nGlass dome\nGold base\nCard",
    images: ["/images/flowers.svg", "/images/home.svg"],
    occasions: ["valentines", "anniversary"], recipients: "her,couples",
    collections: ["talis-signature", "talis-home"], tags: "preserved rose,eternal,anniversary",
    featured: true
  },
  {
    slug: "aurelia-gold-necklace", name: "Aurelia Gold Necklace", category: "jewelry",
    price: 3600, compareAt: null, stock: 12,
    short: "Delicate 18k gold-plated pendant necklace.",
    desc: "A fine cable chain carrying a sculpted teardrop pendant, plated in 18k gold over stainless steel. Tarnish-resistant and shower-safe.\n\nArrives in our velvet jewelry case, ready to give.",
    included: "Necklace 45cm + extender\nVelvet case\nCare card",
    images: ["/images/jewelry.svg", "/images/box-open.svg"],
    occasions: ["birthday", "anniversary", "graduation"], recipients: "her,mum",
    collections: ["talis-moments", "talis-personal"], tags: "necklace,gold,jewelry",
    featured: true, personalizable: true, pFields: [{ label: "Engraved initial (optional)", max: 2 }]
  },
  {
    slug: "classic-cufflinks", name: "Classic Cufflinks", category: "jewelry",
    price: 2200, compareAt: null, stock: 16,
    short: "Brushed gunmetal for the big days.",
    desc: "Minimal rectangular cufflinks in brushed gunmetal with a polished bevel. Presented in a matte black slide box.",
    included: "Pair of cufflinks\nSlide gift box",
    images: ["/images/jewelry.svg"],
    occasions: ["wedding", "graduation"], recipients: "him,dad",
    collections: ["talis-moments"], tags: "cufflinks,groom,wedding",
    personalizable: true, pFields: [{ label: "Engraving (optional)", max: 12 }]
  },
  {
    slug: "silk-sleep-set", name: "Silk Sleep Set", category: "self-care",
    price: 3400, compareAt: null, stock: 13,
    short: "Ivory mulberry-charm pillow set for slow mornings.",
    desc: "An ivory eye mask and scrunchie pair in soft charmeuse silk. Kind to skin and hair, kind to late sleepers. Gift-boxed with a lavender sachet.",
    included: "Silk eye mask\nSilk scrunchie pair\nLavender sachet",
    images: ["/images/selfcare.svg"],
    occasions: ["birthday", "just-because"], recipients: "her,friends,mum",
    collections: ["talis-home"], tags: "sleep,silk,relax",
    isNew: true
  },
  {
    slug: "bath-ritual-set", name: "Bath Ritual Set", category: "self-care",
    price: 2650, compareAt: null, stock: 17,
    short: "Soak, steam, breathe. Repeat.",
    desc: "Botanical bath soak with lavender and eucalyptus, a sisal body mitt and a small room mist — a complete wind-down ritual in one box.",
    included: "Bath soak 300g\nSisal body mitt\nRoom mist 50ml",
    images: ["/images/selfcare.svg", "/images/home.svg"],
    occasions: ["appreciation", "just-because"], recipients: "her,mum,friends",
    collections: ["talis-home"], tags: "bath,spa,relax"
  },
  {
    slug: "gratitude-journal", name: "Gratitude Journal", category: "home",
    price: 1450, compareAt: null, stock: 28,
    short: "Five minutes a day. A calmer mind.",
    desc: "A linen-bound guided journal with morning and evening prompts, printed on cream paper. Optional gold name embossing makes it theirs alone.",
    included: "Linen journal 192 pages\nRibbon marker",
    images: ["/images/journal.svg"],
    occasions: ["birthday", "just-because", "graduation"], recipients: "her,him,friends",
    collections: ["talis-home", "talis-personal"], tags: "journal,gratitude,stationery",
    personalizable: true, pFields: [{ label: "Embossed name (optional)", max: 22 }]
  },
  {
    slug: "ceramic-vase-ivory", name: "Ceramic Vase — Ivory", category: "home",
    price: 1850, compareAt: null, stock: 19,
    short: "Quiet curves for single stems.",
    desc: "Hand-thrown ceramic vase in matte ivory with a subtle speckle. Beautiful empty; better with one perfect stem.",
    included: "Ceramic vase 22cm",
    images: ["/images/vase.svg", "/images/home.svg"],
    occasions: ["wedding", "housewarming"], recipients: "her,couples,mum",
    collections: ["talis-home"], tags: "vase,ceramic,decor"
  },
  {
    slug: "scented-drawer-sachets", name: "Scented Drawer Sachets", category: "home",
    price: 950, compareAt: null, stock: 34,
    short: "Little luxuries in every drawer.",
    desc: "A set of four linen sachets filled with lavender and cedar blend. Tuck into drawers, gym bags or suitcases for weeks of gentle scent.",
    included: "4 linen sachets",
    images: ["/images/home.svg"],
    occasions: ["just-because"], recipients: "her,friends",
    collections: ["talis-home"], tags: "sachets,linen,under 1000"
  },
  {
    slug: "custom-photo-frame", name: "Custom Photo Frame", category: "personalized",
    price: 2100, compareAt: null, stock: 21,
    short: "Your favourite face, framed in gold.",
    desc: "A5 solid-wood frame with a champagne gold border and your chosen text engraved beneath the photo window. Send us the photo after checkout via WhatsApp — we handle the rest.",
    included: "A5 wood frame\nEngraved caption\nGift boxed",
    images: ["/images/frame.svg"],
    occasions: ["anniversary", "birthday", "wedding"], recipients: "her,him,couples,mum,dad",
    collections: ["talis-personal"], tags: "frame,photo,custom",
    featured: true, personalizable: true, pFields: [{ label: "Caption below photo", max: 40 }]
  },
  {
    slug: "engraved-jewelry-box", name: "Engraved Jewelry Box", category: "personalized",
    price: 2950, compareAt: null, stock: 14,
    short: "Her initials, guarding her treasures.",
    desc: "A velvet-lined walnut jewelry box with brass hinges, laser-engraved with a monogram or short message on the lid.",
    included: "Walnut jewelry box\nVelvet lining\nMonogram engraving",
    images: ["/images/engraved.svg"],
    occasions: ["wedding", "anniversary", "birthday"], recipients: "her,mum,friends",
    collections: ["talis-personal", "talis-moments"], tags: "jewelry box,engraved,monogram",
    personalizable: true, pFields: [{ label: "Monogram", max: 3 }, { label: "Message inside lid", max: 60 }]
  }
];

const reviews = [
  { product: "talis-signature-box", name: "Wanjiru K.", rating: 5, title: "She cried (happy tears)", body: "Sent this to my sister in Kilimani and she called me crying. The packaging alone is a gift.", approved: true },
  { product: "talis-signature-box", name: "Mutua D.", rating: 5, title: "Premium feel", body: "Ordered for my wife's birthday. Delivery was same-day and the box felt genuinely expensive.", approved: true },
  { product: "personalized-mug", name: "Grace A.", rating: 4, title: "Lovely print quality", body: "Mum loved seeing her name. Print is crisp. Would love a bigger size option.", approved: true },
  { product: "talis-candle-vanilla-noir", name: "Kevin M.", rating: 5, title: "Best candle in Nairobi", body: "Burns evenly and the scent fills the whole living room. Already reordered twice.", approved: true },
  { product: "eternal-rose-dome", name: "Fatuma S.", rating: 5, title: "Still perfect after months", body: "Anniversary gift from my husband. Months later it looks exactly like day one.", approved: true },
  { product: "luxe-tumbler", name: "Otieno J.", rating: 4, title: "Solid tumbler", body: "Engraving came out clean. Keeps my coffee hot till noon as promised.", approved: true },
  { product: "golden-moments-box", name: "Njeri W.", rating: 5, title: "Worth every shilling", body: "Sent to my mum up-country. Arrived intact in two days and she hasn't stopped talking about it.", approved: true }
];

async function main() {
  await Promise.all([
    db.orderItem.deleteMany(), db.orderEvent.deleteMany(), db.payment.deleteMany(),
    db.giftBoxItem.deleteMany(), db.cartItem.deleteMany(),
    db.wishlistItem.deleteMany(), db.review.deleteMany(), db.inventory.deleteMany(),
    db.productImage.deleteMany(), db.productVariant.deleteMany(),
    db.discount.deleteMany()
  ]);
  await db.order.deleteMany();
  await db.giftBox.deleteMany();
  await db.address.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();
  await db.collection.deleteMany();
  await db.occasion.deleteMany();
  await db.deliveryZone.deleteMany();
  await db.newsletterSubscriber.deleteMany();
  await db.contactMessage.deleteMany();
  await db.setting.deleteMany();
  await db.user.deleteMany();

  const admin = await db.user.create({
    data: { name: "Talis Admin", email: "admin@talisgiftshop.co.ke", phone: "+254712345678", passwordHash: hashPassword("TalisAdmin123!"), role: "ADMIN" }
  });
  const sarah = await db.user.create({
    data: { name: "Sarah Njeri", email: "sarah@example.com", phone: "+254722000111", passwordHash: hashPassword("Password123!") }
  });

  const catMap = {};
  for (const [slug, name] of categories) catMap[slug] = await db.category.create({ data: { slug, name } });
  const colMap = {};
  for (const [slug, name, tagline, image, featured] of collections)
    colMap[slug] = await db.collection.create({ data: { slug, name, tagline, image, featured } });
  const occMap = {};
  for (const [slug, name, blurb] of occasions) occMap[slug] = await db.occasion.create({ data: { slug, name, blurb } });

  const prodMap = {};
  for (const p of products) {
    prodMap[p.slug] = await db.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        shortDesc: p.short,
        description: p.desc,
        price: p.price,
        compareAtPrice: p.compareAt ?? null,
        categoryId: catMap[p.category].id,
        tags: p.tags ?? "",
        recipients: (p.recipients ?? "").split(",").map((s) => s.trim()).filter(Boolean).join(","),
        whatsIncluded: p.included ?? "",
        personalizable: Boolean(p.personalizable),
        personalizationFields: p.pFields ? JSON.stringify(p.pFields) : "",
        featured: Boolean(p.featured),
        bestSeller: Boolean(p.bestSeller),
        isNew: Boolean(p.isNew),
        soldCount: p.bestSeller ? Math.floor(Math.random() * 90) + 30 : Math.floor(Math.random() * 25),
        inventory: inv(p.stock),
        images: { create: p.images.map((url, i) => ({ url, sort: i, alt: p.name })) },
        occasions: { connect: (p.occasions ?? []).map((s) => ({ id: occMap[s].id })) },
        collections: { connect: (p.collections ?? []).map((s) => ({ id: colMap[s].id })) }
      }
    });
  }

  for (const r of reviews) {
    await db.review.create({
      data: { productId: prodMap[r.product].id, userId: null, name: r.name, rating: r.rating, title: r.title, body: r.body, approved: r.approved }
    });
  }
  await db.review.create({
    data: { productId: prodMap["self-love-box"].id, userId: sarah.id, name: "Sarah Njeri", rating: 5, title: "My Sunday reset", body: "Bought this for myself and I regret nothing. The bath soak smells incredible.", approved: true }
  });

  await db.discount.createMany({
    data: [
      { code: "WELCOME10", type: "PERCENT", value: 10, minSubtotal: 0, active: true },
      { code: "TALISLOVE", type: "FIXED", value: 500, minSubtotal: 3000, active: true },
      { code: "BIRTHDAY15", type: "PERCENT", value: 15, minSubtotal: 2500, expiresAt: new Date(Date.now() + 90 * 86400000), usageLimit: 200, active: true }
    ]
  });

  await db.deliveryZone.createMany({
    data: [
      { name: "Nairobi — CBD & Westlands", fee: 0, etaNote: "Same-day before 12pm orders" },
      { name: "Nairobi — Suburbs", fee: 0, etaNote: "Within 24 hours" },
      { name: "Rest of Kenya", fee: 0, etaNote: "2–3 working days" }
    ]
  });

  const settings = {
    announcement: "",
    whatsapp: "254711436169",
    phone: "+254 711 436 169",
    email: "hello@talisgiftshop.co.ke",
    address: "The Alchemist, Westlands, Nairobi, Kenya",
    hours: "Mon – Sat: 9:00am – 7:00pm",
    instagramHandle: "@talisgiftshop",
    instagramImages: JSON.stringify(["/images/box.svg", "/images/flowers.svg", "/images/candle.svg", "/images/jewelry.svg", "/images/selfcare.svg", "/images/mug.svg"]),
    mpesaPaybill: "M-PESA Till 123456 (demo)",
    heroTitle: "Beyond the Feeling",
    heroSub: "Thoughtful gifts for the moments that matter.",
    heroDesc: "Discover beautifully curated gifts designed to make every moment unforgettable."
  };
  for (const [key, value] of Object.entries(settings)) await db.setting.create({ data: { key, value } });

  const zone = await db.deliveryZone.findFirst();
  const demoItems = [
    { productId: prodMap["talis-candle-vanilla-noir"].id, name: "Talis Candle — Vanilla Noir", imageUrl: "/images/candle.svg", unitPrice: 1500, qty: 2 },
    { productId: prodMap["personalized-mug"].id, name: "Personalized Mug", imageUrl: "/images/mug.svg", unitPrice: 1200, qty: 1, variantJson: null, personalizationJson: JSON.stringify({ Name: "Mum" }) }
  ];
  const demoSubtotal = demoItems.reduce((a, i) => a + i.unitPrice * i.qty, 0);
  const now = Date.now();
  const demoOrder = await db.order.create({
    data: {
      orderNumber: "TG-DEMO001",
      userId: sarah.id,
      email: "sarah@example.com",
      phone: "+254722000111",
      deliveryName: "Sarah Njeri",
      addressLine: "12 Rose Avenue, Kilimani",
      city: "Nairobi",
      zoneId: zone.id,
      zoneName: zone.name,
      subtotal: demoSubtotal,
      discountTotal: 0,
      deliveryFee: zone.fee,
      total: demoSubtotal + zone.fee,
      status: "DELIVERED",
      estimatedDelivery: new Date(now - 86400000),
      items: { create: demoItems },
      events: {
        create: [
          { status: "PENDING", createdAt: new Date(now - 5 * 86400000), note: "We received your order." },
          { status: "PAID", createdAt: new Date(now - 5 * 86400000 + 3600000), note: "M-PESA payment confirmed." },
          { status: "PROCESSING", createdAt: new Date(now - 4 * 86400000), note: "Your gifts are being prepared." },
          { status: "PACKAGING", createdAt: new Date(now - 4 * 86400000 + 7200000), note: "Beautifully packaged by hand." },
          { status: "OUT_FOR_DELIVERY", createdAt: new Date(now - 3 * 86400000), note: "On the way to Kilimani." },
          { status: "DELIVERED", createdAt: new Date(now - 3 * 86400000 + 5400000), note: "Delivered with a smile." }
        ]
      },
      payment: { create: { provider: "mpesa", method: "MPESA", status: "PAID", reference: "QGH7DEMO01", amount: demoSubtotal + zone.fee } }
    }
  });
  void demoOrder;

  console.log("Seed complete.");
  console.log("Admin login: admin@talisgiftshop.co.ke / TalisAdmin123!");
  console.log("Customer login: sarah@example.com / Password123!");
  console.log(`Products: ${products.length}, Categories: ${categories.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
