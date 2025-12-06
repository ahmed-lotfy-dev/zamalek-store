export const categoriesData = [
  { name: "القمصان", nameEn: "Jerseys" },
  { name: "تي شيرتات", nameEn: "T-Shirts" },
  { name: "هوديز", nameEn: "Hoodies" },
  { name: "جاكيتات", nameEn: "Jackets" },
  { name: "بنطلونات", nameEn: "Pants" },
  { name: "شورتات", nameEn: "Shorts" },
  { name: "أحذية", nameEn: "Footwear" },
  { name: "إكسسوارات", nameEn: "Accessories" },
  { name: "تذكارات", nameEn: "Memorabilia" },
  { name: "ملابس تدريب", nameEn: "Training" },
];

const baseProducts = [
  // Jerseys
  {
    nameEn: "Zamalek SC Home Jersey 24/25",
    name: "قميص الزمالك الأساسي 24/25",
    descriptionEn:
      "Official Zamalek SC Home Jersey. Iconic white design with two red lines.",
    description: "القميص الرسمي لنادي الزمالك. تصميم أبيض أيقوني بخطين حمر.",
    price: 3500,
    categoryNameEn: "Jerseys",
    image:
      "https://images.unsplash.com/photo-1626379616459-b2ce1d9decbc?q=80&w=800&auto=format&fit=crop",
  },
  {
    nameEn: "Zamalek SC Away Jersey 24/25",
    name: "قميص الزمالك الاحتياطي 24/25",
    descriptionEn: "Sleek black away jersey.",
    description: "القميص الاحتياطي الأسود الأنيق.",
    price: 3500,
    categoryNameEn: "Jerseys",
    image:
      "https://images.unsplash.com/photo-1577212017184-80cc2589c397?q=80&w=800&auto=format&fit=crop",
  },
  // T-Shirts
  {
    nameEn: "1911 Legacy Tee",
    name: "تي شيرت 1911",
    descriptionEn: "Cotton tee celebrating the founding year.",
    description: "تي شيرت قطني يحتفل بسنة التأسيس.",
    price: 900,
    categoryNameEn: "T-Shirts",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
  },
  // Hoodies
  {
    nameEn: "Zamalek Winter Hoodie",
    name: "هودي الزمالك الشتوي",
    descriptionEn: "Heavy hoodie for winter warmth.",
    description: "هودي ثقيل للتدفئة في الشتاء.",
    price: 2200,
    categoryNameEn: "Hoodies",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
  },
  // Jackets
  {
    nameEn: "Training Jacket",
    name: "جاكيت التدريب",
    descriptionEn: "Water-resistant jacket for training.",
    description: "جاكيت مقاوم للماء للتدريبات.",
    price: 2500,
    categoryNameEn: "Jackets",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop",
  },
  // Pants
  {
    nameEn: "Track Pants",
    name: "بنطلون رياضي",
    descriptionEn: "Comfortable track pants for running.",
    description: "بنطلون رياضي مريح للجري.",
    price: 1500,
    categoryNameEn: "Pants",
    image:
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=800&auto=format&fit=crop",
  },
  // Shorts
  {
    nameEn: "Training Shorts",
    name: "شورت التدريب",
    descriptionEn: "Lightweight shorts for workouts.",
    description: "شورت خفيف للتمارين.",
    price: 800,
    categoryNameEn: "Shorts",
    image:
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop",
  },
  // Footwear
  {
    nameEn: "Pro Running Shoes",
    name: "حذاء الجري الاحترافي",
    descriptionEn: "High-performance running shoes.",
    description: "حذاء جري عالي الأداء.",
    price: 4500,
    categoryNameEn: "Footwear",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
  },
  // Accessories
  {
    nameEn: "Zamalek Scarf",
    name: "كوفية الزمالك",
    descriptionEn: "Official fan scarf.",
    description: "كوفية المشجعين الرسمية.",
    price: 450,
    categoryNameEn: "Accessories",
    image:
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=800&auto=format&fit=crop",
  },
  // Memorabilia
  {
    nameEn: "Signed Ball",
    name: "كرة موقعة",
    descriptionEn: "Authentic match ball signed by the team.",
    description: "كرة مباراة أصلية موقعة من الفريق.",
    price: 5000,
    categoryNameEn: "Memorabilia",
    image:
      "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?q=80&w=800&auto=format&fit=crop",
  },
  // Training
  {
    nameEn: "Training Bib",
    name: "قميص تدريب",
    descriptionEn: "Lightweight training bib.",
    description: "قميص تدريب خفيف الوزن.",
    price: 300,
    categoryNameEn: "Training",
    image:
      "https://images.unsplash.com/photo-1562771242-a02d9090c90c?q=80&w=800&auto=format&fit=crop",
  },
];

// Generate 100+ products
export const productsData: {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  categoryNameEn: string;
  slug: string;
  images: string[];
  isFeatured: boolean;
}[] = [];

// Add base products first
baseProducts.forEach((p, index) => {
  const { image, ...rest } = p;
  productsData.push({
    ...rest,
    slug: p.nameEn.toLowerCase().replace(/ /g, "-") + "-" + index,
    images: [p.image],
    isFeatured: index < 5, // Feature first 5
  });
});

// Generate variations to reach 100
const adjectivesEn = [
  "Pro",
  "Elite",
  "Classic",
  "Urban",
  "Retro",
  "Modern",
  "Limited",
  "Premium",
];
const adjectivesAr = [
  "احترافي",
  "نخبة",
  "كلاسيكي",
  "حضري",
  "ريترو",
  "عصري",
  "محدود",
  "فاخر",
];

let counter = baseProducts.length;
while (productsData.length < 105) {
  const base = baseProducts[Math.floor(Math.random() * baseProducts.length)];
  const adjIndex = Math.floor(Math.random() * adjectivesEn.length);

  const newPrice = Math.floor(base.price * (0.8 + Math.random() * 0.4)); // +/- 20% price variation

  productsData.push({
    nameEn: `${adjectivesEn[adjIndex]} ${base.nameEn}`,
    name: `${base.name} ${adjectivesAr[adjIndex]}`,
    descriptionEn: `${base.descriptionEn} - ${adjectivesEn[adjIndex]} Edition`,
    description: `${base.description} - إصدار ${adjectivesAr[adjIndex]}`,
    price: newPrice,
    categoryNameEn: base.categoryNameEn,
    slug: `${base.nameEn.toLowerCase().replace(/ /g, "-")}-${adjectivesEn[
      adjIndex
    ].toLowerCase()}-${counter}`,
    images: [base.image], // Reusing image for now, ideally would rotate images
    isFeatured: Math.random() > 0.9, // 10% chance to be featured
  });
  counter++;
}

export const usersData = [
  { name: "Ahmed Ali", email: "ahmed@example.com" },
  { name: "Mohamed Hassan", email: "mohamed@example.com" },
  { name: "Sara Mahmoud", email: "sara@example.com" },
  { name: "Omar Khaled", email: "omar@example.com" },
  { name: "Nour Ezzat", email: "nour@example.com" },
];

export const commentsData = [
  "Great quality! Excellent material.",
  "جودة ممتازة وسعر مناسب.",
  "Fits perfectly, love it.",
  "التوصيل كان سريع جداً.",
  "Not bad, but size runs small.",
];

export const subscribersData = [
  "fan1@zamalek.com",
  "fan2@zamalek.com",
  "fan3@zamalek.com",
];
