export type ProductGalleryImage = {
  src: string;
  alt: string;
  label: string;
};

export type Product = {
  slug: string;
  name: string;
  category: "زنانه" | "مردانه" | "ست ورزشی";
  categoryKey: "women" | "men" | "sets";
  image: string;
  imageAlt: string;
  sizes: string[];
  shortDescription: string;
  description: string;
  status: "موجودی با استعلام" | "موجود" | "ناموجود" | "در حال تولید";
  gallery?: ProductGalleryImage[];
  sku?: string;
  material?: string;
  colors?: string[];
  price?: string;
  pack?: string;
  quality?: string;
  salesTelegram?: string;
  phoneLabel?: string;
  phoneHref?: string;
};

export const products: Product[] = [
  {
    slug: "kimono-crop-112",
    name: "کراپ کیمونو",
    category: "زنانه",
    categoryKey: "women",
    image: "/images/products/112/black.webp",
    imageAlt: "کراپ کیمونو زنانه مشکی کد ۱۱۲ میلنیوم اسپرت",
    gallery: [
      { src: "/images/products/112/black.webp", alt: "کراپ کیمونو زنانه مشکی کد ۱۱۲", label: "مشکی" },
      { src: "/images/products/112/olive.webp", alt: "کراپ کیمونو زنانه زیتونی کد ۱۱۲", label: "زیتونی" },
      { src: "/images/products/112/purple.webp", alt: "کراپ کیمونو زنانه بنفش کد ۱۱۲", label: "بنفش" },
      { src: "/images/products/112/brown.webp", alt: "کراپ کیمونو زنانه قهوه‌ای کد ۱۱۲", label: "قهوه‌ای" },
      { src: "/images/products/112/navy.webp", alt: "کراپ کیمونو زنانه سرمه‌ای کد ۱۱۲", label: "سرمه‌ای" },
      { src: "/images/products/112/white.webp", alt: "کراپ کیمونو زنانه سفید کد ۱۱۲", label: "سفید" },
      { src: "/images/products/112/gray.webp", alt: "کراپ کیمونو زنانه طوسی کد ۱۱۲", label: "طوسی" },
      { src: "/images/products/112/purple-alt.webp", alt: "نمای دوم کراپ کیمونو زنانه بنفش کد ۱۱۲", label: "نمای دوم بنفش" },
    ],
    sku: "112",
    material: "فیلامنت اعلا",
    colors: ["مشکی", "زیتونی", "بنفش", "قهوه‌ای", "سرمه‌ای", "سفید", "طوسی"],
    sizes: ["فری‌سایز", "مناسب ۳۸ تا ۴۴"],
    price: "۳۹۰ هزار تومان",
    pack: "جین ۶ تا ۱۴",
    quality: "A++++",
    shortDescription: "کراپ ورزشی زنانه با پارچه فیلامنت اعلا و فری‌سایز مناسب ۳۸ تا ۴۴.",
    description:
      "کراپ کیمونو زنانه کد ۱۱۲، تولیدشده از فیلامنت اعلا و مناسب تأمین عمده فروشگاه‌های پوشاک ورزشی. این مدل به‌صورت فری‌سایز برای سایزهای ۳۸ تا ۴۴ ارائه می‌شود و رنگ‌بندی آن مطابق تصاویر گالری است.",
    status: "موجودی با استعلام",
    salesTelegram: "https://t.me/millennium_sport",
    phoneLabel: "۰۹۱۲۰۹۳۵۵۳۴",
    phoneHref: "tel:+989120935534",
  },
  {
    slug: "full-zip-short-sleeve-57",
    name: "تیشرت آستین‌کوتاه تمام‌زیپ برش‌دار",
    category: "زنانه",
    categoryKey: "women",
    image: "/images/products/57/black-model.webp",
    imageAlt: "تیشرت آستین‌کوتاه تمام‌زیپ برش‌دار زنانه مشکی کد ۵۷ روی مدل",
    gallery: [
      { src: "/images/products/57/black-model.webp", alt: "تیشرت آستین‌کوتاه تمام‌زیپ برش‌دار مشکی کد ۵۷ روی مدل", label: "مشکی" },
      { src: "/images/products/57/lilac-model.webp", alt: "تیشرت آستین‌کوتاه تمام‌زیپ برش‌دار یاسی کد ۵۷ روی مدل", label: "یاسی" },
      { src: "/images/products/57/brown-model.webp", alt: "تیشرت آستین‌کوتاه تمام‌زیپ برش‌دار قهوه‌ای کد ۵۷ روی مدل", label: "قهوه‌ای" },
      { src: "/images/products/57/coral-model.webp", alt: "تیشرت آستین‌کوتاه تمام‌زیپ برش‌دار گلبهی کد ۵۷ روی مدل", label: "گلبهی" },
      { src: "/images/products/57/white-model.webp", alt: "تیشرت آستین‌کوتاه تمام‌زیپ برش‌دار سفید با زیپ سفید کد ۵۷ روی مدل", label: "سفید" },
      { src: "/images/products/57/color-set-main.webp", alt: "مجموعه رنگ‌های تیشرت آستین‌کوتاه تمام‌زیپ برش‌دار کد ۵۷", label: "رنگ‌بندی کامل" },
      { src: "/images/products/57/white-product.webp", alt: "نمای محصول سفید با زیپ سفید تیشرت تمام‌زیپ کد ۵۷", label: "نمای سفید" },
      { src: "/images/products/57/collar-detail.webp", alt: "جزئیات یقه و زیپ سفید تیشرت تمام‌زیپ کد ۵۷", label: "جزئیات یقه" },
    ],
    sku: "57",
    material: "فیلامنت اعلا",
    colors: ["مشکی", "یاسی", "قهوه‌ای", "گلبهی", "سفید"],
    sizes: ["L", "XL", "مناسب ۳۸ تا ۴۴"],
    price: "۵۴۰ هزار تومان",
    pack: "جین‌های ۶، ۸ و ۱۲ عددی",
    quality: "A++++",
    shortDescription: "مدل زنانه آستین‌کوتاه تمام‌زیپ با فیلامنت اعلا، مناسب خرید عمده در سایزهای L و XL.",
    description:
      "تیشرت آستین‌کوتاه تمام‌زیپ برش‌دار زنانه کد ۵۷، تولیدشده از فیلامنت اعلا و مناسب تأمین عمده فروشگاه‌های پوشاک ورزشی است. این مدل در سایزهای L و XL، مناسب بازه ۳۸ تا ۴۴، و با رنگ‌بندی مشکی، یاسی، قهوه‌ای، گلبهی و سفید عرضه می‌شود. زیپ مدل سفید نیز کاملاً سفید است. موجودی هر رنگ و ترکیب دقیق جین پیش از ثبت سفارش توسط واحد فروش تأیید می‌شود.",
    status: "موجودی با استعلام",
    salesTelegram: "https://t.me/millennium_sport",
    phoneLabel: "۰۹۱۲۰۹۳۵۵۳۴",
    phoneHref: "tel:+989120935534",
  },
  {
    slug: "full-zip-long-sleeve-86",
    name: "تیشرت آستین‌بلند تمام‌زیپ برش‌دار",
    category: "زنانه",
    categoryKey: "women",
    image: "/images/products/86/lilac.webp",
    imageAlt: "تیشرت آستین‌بلند تمام‌زیپ برش‌دار زنانه یاسی کد ۸۶ روی مدل",
    gallery: [
      { src: "/images/products/86/lilac.webp", alt: "تیشرت آستین‌بلند تمام‌زیپ برش‌دار یاسی کد ۸۶ روی مدل", label: "یاسی" },
      { src: "/images/products/86/white.webp", alt: "تیشرت آستین‌بلند تمام‌زیپ برش‌دار سفید کد ۸۶ روی مدل", label: "سفید" },
      { src: "/images/products/86/brown.webp", alt: "تیشرت آستین‌بلند تمام‌زیپ برش‌دار قهوه‌ای کد ۸۶ روی مدل", label: "قهوه‌ای" },
      { src: "/images/products/86/black.webp", alt: "تیشرت آستین‌بلند تمام‌زیپ برش‌دار مشکی کد ۸۶ روی مدل", label: "مشکی" },
      { src: "/images/products/86/coral.webp", alt: "تیشرت آستین‌بلند تمام‌زیپ برش‌دار گلبهی کد ۸۶ روی مدل", label: "گلبهی" },
      { src: "/images/products/86/color-set-main.webp", alt: "مجموعه رنگ‌های تیشرت آستین‌بلند تمام‌زیپ برش‌دار کد ۸۶", label: "رنگ‌بندی کامل" },
      { src: "/images/products/86/color-set-sleeves.webp", alt: "نمای چیدمان رنگ و آستین تیشرت تمام‌زیپ کد ۸۶", label: "نمای رنگ‌ها" },
      { src: "/images/products/86/color-set-alt.webp", alt: "نمای دوم مجموعه رنگ‌های تیشرت تمام‌زیپ کد ۸۶", label: "نمای دوم" },
      { src: "/images/products/86/collar-detail.webp", alt: "جزئیات یقه و دوخت تیشرت تمام‌زیپ کد ۸۶", label: "جزئیات یقه" },
      { src: "/images/products/86/sleeve-detail.webp", alt: "جزئیات آستین و برش تیشرت تمام‌زیپ کد ۸۶", label: "جزئیات دوخت" },
    ],
    sku: "86",
    material: "فیلامنت اعلا",
    colors: ["یاسی", "سفید", "قهوه‌ای", "مشکی", "گلبهی"],
    sizes: ["L", "XL", "مناسب ۳۸ تا ۴۴"],
    price: "۶۴۰ هزار تومان",
    pack: "جین‌های ۶، ۸ و ۱۲ عددی",
    quality: "A++++",
    shortDescription: "مدل زنانه تمام‌زیپ برش‌دار با فیلامنت اعلا، مناسب خرید عمده در سایزهای L و XL.",
    description:
      "تیشرت آستین‌بلند تمام‌زیپ برش‌دار زنانه کد ۸۶، تولیدشده از فیلامنت اعلا و مناسب تأمین عمده فروشگاه‌های پوشاک ورزشی است. این مدل در سایزهای L و XL، مناسب بازه ۳۸ تا ۴۴، و با رنگ‌بندی یاسی، سفید، قهوه‌ای، مشکی و گلبهی ارائه می‌شود. موجودی هر رنگ و ترکیب دقیق جین پیش از ثبت سفارش توسط واحد فروش تأیید می‌شود.",
    status: "موجودی با استعلام",
    salesTelegram: "https://t.me/millennium_sport",
    phoneLabel: "۰۹۱۲۰۹۳۵۵۳۴",
    phoneHref: "tel:+989120935534",
  },
  {
    slug: "nike-leggings-155",
    name: "لگ نایکی",
    category: "زنانه",
    categoryKey: "women",
    image: "/images/products/155/black-model.webp",
    imageAlt: "لگ نایکی زنانه مشکی با لوگوی سفید کد ۱۵۵ روی مدل",
    gallery: [
      { src: "/images/products/155/black-model.webp", alt: "لگ نایکی زنانه مشکی با لوگوی سفید کد ۱۵۵ روی مدل", label: "مشکی" },
      { src: "/images/products/155/white-model.webp", alt: "لگ نایکی زنانه سفید کد ۱۵۵ روی مدل", label: "سفید" },
      { src: "/images/products/155/purple-model.webp", alt: "لگ نایکی زنانه بنفش کد ۱۵۵ روی مدل", label: "بنفش" },
      { src: "/images/products/155/navy-model.webp", alt: "لگ نایکی زنانه سرمه‌ای کد ۱۵۵ روی مدل", label: "سرمه‌ای" },
      { src: "/images/products/155/gray-model.webp", alt: "لگ نایکی زنانه طوسی کد ۱۵۵ روی مدل", label: "طوسی" },
      { src: "/images/products/155/olive-model.webp", alt: "لگ نایکی زنانه سبز زیتونی کد ۱۵۵ روی مدل", label: "سبز زیتونی" },
      { src: "/images/products/155/color-set.webp", alt: "مجموعه رنگ‌های لگ نایکی زنانه کد ۱۵۵", label: "رنگ‌بندی کامل" },
      { src: "/images/products/155/detail.webp", alt: "نمای نزدیک پارچه و دوخت لگ نایکی زنانه کد ۱۵۵", label: "جزئیات دوخت" },
    ],
    sku: "155",
    material: "فیلامنت اعلا",
    colors: ["مشکی", "سفید", "بنفش", "سرمه‌ای", "طوسی", "سبز زیتونی", "قهوه‌ای"],
    sizes: ["L", "XL", "مناسب ۴۰ تا ۴۶"],
    price: "۶۴۰ هزار تومان",
    pack: "جین‌های ۱۴ و ۱۶ عددی",
    quality: "A++++",
    shortDescription: "لگ ورزشی زنانه از فیلامنت اعلا، مناسب خرید عمده در سایزهای L و XL و بازه ۴۰ تا ۴۶.",
    description:
      "لگ نایکی زنانه کد ۱۵۵، تولیدشده از فیلامنت اعلا و مناسب تأمین عمده فروشگاه‌های پوشاک ورزشی است. این مدل در سایزهای L و XL، مناسب بازه ۴۰ تا ۴۶، و با رنگ‌بندی مشکی، سفید، بنفش، سرمه‌ای، طوسی، سبز زیتونی و قهوه‌ای عرضه می‌شود. لوگوی مدل مشکی سفید است. موجودی هر رنگ و ترکیب دقیق جین پیش از ثبت سفارش توسط واحد فروش تأیید می‌شود.",
    status: "موجودی با استعلام",
    salesTelegram: "https://t.me/millennium_sport",
    phoneLabel: "۰۹۱۲۰۹۳۵۵۳۴",
    phoneHref: "tel:+989120935534",
  },
  {
    slug: "nike-bermuda-148",
    name: "برمودا نایکی",
    category: "زنانه",
    categoryKey: "women",
    image: "/images/products/148/navy-model.webp",
    imageAlt: "برمودا نایکی زنانه سرمه‌ای کد ۱۴۸ روی مدل",
    gallery: [
      { src: "/images/products/148/navy-model.webp", alt: "برمودا نایکی زنانه سرمه‌ای کد ۱۴۸ روی مدل", label: "سرمه‌ای" },
      { src: "/images/products/148/purple-model.webp", alt: "برمودا نایکی زنانه بنفش کد ۱۴۸ روی مدل", label: "بنفش" },
      { src: "/images/products/148/brown-model.webp", alt: "برمودا نایکی زنانه قهوه‌ای کد ۱۴۸ روی مدل", label: "قهوه‌ای" },
      { src: "/images/products/148/white-model.webp", alt: "برمودا نایکی زنانه سفید کد ۱۴۸ روی مدل", label: "سفید" },
      { src: "/images/products/148/color-set.webp", alt: "مجموعه رنگ‌های برمودا نایکی زنانه کد ۱۴۸", label: "رنگ‌بندی کامل" },
      { src: "/images/products/148/detail.webp", alt: "نمای نزدیک پارچه و دوخت برمودا نایکی زنانه کد ۱۴۸", label: "جزئیات دوخت" },
    ],
    sku: "148",
    material: "فیلامنت اعلا",
    colors: ["سرمه‌ای", "بنفش", "طوسی", "مشکی", "سفید", "سبز زیتونی", "قهوه‌ای"],
    sizes: ["L", "XL", "مناسب ۴۰ تا ۴۶"],
    price: "۶۲۰ هزار تومان",
    pack: "جین‌های ۱۴ و ۱۶ عددی",
    quality: "A++++",
    shortDescription: "برمودا ورزشی زنانه از فیلامنت اعلا، مناسب خرید عمده در سایزهای L و XL و بازه ۴۰ تا ۴۶.",
    description:
      "برمودا نایکی زنانه کد ۱۴۸، تولیدشده از فیلامنت اعلا و مناسب تأمین عمده فروشگاه‌های پوشاک ورزشی است. این مدل در سایزهای L و XL، مناسب بازه ۴۰ تا ۴۶، و با رنگ‌بندی سرمه‌ای، بنفش، طوسی، مشکی، سفید، سبز زیتونی و قهوه‌ای عرضه می‌شود. موجودی هر رنگ و ترکیب دقیق جین پیش از ثبت سفارش توسط واحد فروش تأیید می‌شود.",
    status: "موجودی با استعلام",
    salesTelegram: "https://t.me/millennium_sport",
    phoneLabel: "۰۹۱۲۰۹۳۵۵۳۴",
    phoneHref: "tel:+989120935534",
  },
  {
    slug: "mesh-sports-bra-64",
    name: "نیم‌تنه توری",
    category: "زنانه",
    categoryKey: "women",
    image: "/images/products/64/mint.webp",
    imageAlt: "نیم‌تنه توری زنانه سبزآبی کد ۶۴ روی مدل",
    gallery: [
      { src: "/images/products/64/mint.webp", alt: "نیم‌تنه توری زنانه سبزآبی کد ۶۴ روی مدل", label: "سبزآبی" },
      { src: "/images/products/64/gray.webp", alt: "نیم‌تنه توری زنانه طوسی کد ۶۴ روی مدل", label: "طوسی" },
      { src: "/images/products/64/black.webp", alt: "نیم‌تنه توری زنانه مشکی کد ۶۴ روی مدل", label: "مشکی" },
      { src: "/images/products/64/back.webp", alt: "نمای پشت نیم‌تنه توری زنانه کد ۶۴", label: "نمای پشت" },
      { src: "/images/products/64/color-set.webp", alt: "نمای چیدمان رنگ‌بندی نیم‌تنه توری زنانه کد ۶۴", label: "نمای چیدمان" },
    ],
    sku: "64",
    material: "فلامنت",
    colors: ["سبزآبی", "طوسی", "مشکی"],
    sizes: ["فری‌سایز"],
    price: "۳۷۰ هزار تومان",
    pack: "جین ۲۴، ۱۲ و ۶ عددی",
    quality: "A+++++",
    shortDescription: "نیم‌تنه ورزشی زنانه توری کد ۶۴ از جنس فلامنت، فری‌سایز و مناسب خرید عمده.",
    description:
      "نیم‌تنه توری زنانه کد ۶۴، مدل اقتصادی و مناسب استفاده ورزشی، تولیدشده از جنس فلامنت و ارائه‌شده در سایز فری‌سایز. رنگ‌بندی این محصول مطابق تصاویر گالری شامل سبزآبی، طوسی و مشکی است. این مدل با کیفیت A+++++ عرضه می‌شود و برای خرید عمده در جین‌های ۲۴، ۱۲ و ۶ عددی ارائه شده است. موجودی و ترکیب دقیق رنگ‌ها پیش از ثبت سفارش توسط واحد فروش تأیید می‌شود.",
    status: "موجودی با استعلام",
    salesTelegram: "https://t.me/millennium_sport",
    phoneLabel: "۰۹۱۲۰۹۳۵۵۳۴",
    phoneHref: "tel:+989120935534",
  },
];

export const featuredProduct = products[0];
