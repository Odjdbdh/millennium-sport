import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Icon from "./components/Icon";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import StoreMap from "./components/StoreMap";
import { featuredProduct as fallbackFeaturedProduct } from "./data/products";
import { getCatalogProducts } from "./lib/catalog";

export const metadata: Metadata = {
  title: "تولید و پخش عمده پوشاک ورزشی",
  description: "میلنیوم اسپرت؛ تأمین عمده پوشاک ورزشی برای فروشگاه‌ها و پخش‌کننده‌ها، مستقیم از تولیدکننده و با ارسال به سراسر ایران.",
  alternates: { canonical: "/" },
};

const benefits = [
  { icon: "award" as const, title: "۲۶ سال تجربه تولید", text: "تجربه‌ای خانوادگی که از نسل پیشین آغاز شده و امروز با مدیریت حسن اصلانی ادامه دارد." },
  { icon: "box" as const, title: "تأمین مستقیم", text: "ارتباط بدون واسطه با مجموعه تولیدی برای استعلام موجودی و قیمت همکاری." },
  { icon: "users" as const, title: "تمرکز کامل بر همکار", text: "ساختار سایت و واحد فروش برای فروشگاه‌ها، پخش‌کننده‌ها و مجموعه‌های ورزشی طراحی شده است." },
  { icon: "pin" as const, title: "پوشش سراسر ایران", text: "هماهنگی و ارسال سفارش‌های عمده برای همکاران در ۳۱ استان کشور." },
];

const steps = [
  ["۰۱", "انتخاب محصول", "مدل موردنظر را از کاتالوگ انتخاب کنید یا برای دریافت کاتالوگ روز درخواست بدهید."],
  ["۰۲", "ثبت نیاز خرید", "محصول، تعداد تقریبی، شهر و مشخصات فروشگاه خود را در فرم همکاری وارد کنید."],
  ["۰۳", "تأیید قیمت و موجودی", "واحد فروش، موجودی مدل و سایز و قیمت همکاری روز را با شما هماهنگ می‌کند."],
  ["۰۴", "پیش‌فاکتور و ارسال", "پس از تأیید نهایی، جزئیات پیش‌فاکتور و نحوه ارسال سفارش هماهنگ می‌شود."],
];

export default async function Home() {
  const [featuredProduct = fallbackFeaturedProduct] = await getCatalogProducts();
  return (
    <div className="site-shell">
      <SiteHeader active="home" />
      <main id="main-content">
        <section className="hero hero--without-media" id="top">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-copy">
            <div className="eyebrow"><span /> تولید و پخش عمده پوشاک ورزشی از سال ۱۳۷۹</div>
            <h1><em>۲۶</em> سال تولید؛<br />تأمین عمده بدون واسطه</h1>
            <p>ویژه فروشگاه‌ها، پخش‌کننده‌ها و مجموعه‌های ورزشی؛ با قیمت همکاری، استعلام موجودی روز و ارسال سفارش عمده به سراسر ایران.</p>
            <div className="hero-ctas">
              <Link className="primary-cta" href="/quote">درخواست قیمت همکاری <Icon name="arrow" /></Link>
              <Link className="secondary-cta" href="/shop">مشاهده کاتالوگ عمده <Icon name="arrow" /></Link>
            </div>
            <div className="hero-proof" aria-label="مزیت‌های همکاری با میلنیوم اسپرت">
              <div><span className="proof-icon"><Icon name="award" /></span><span><strong>قیمت تولیدی</strong><small>ویژه همکاران</small></span></div>
              <div><span className="proof-icon"><Icon name="pin" /></span><span><strong>۳۱ استان</strong><small>ارسال سفارش عمده</small></span></div>
              <div><span className="proof-icon"><Icon name="box" /></span><span><strong>استعلام روز</strong><small>مدل، سایز و موجودی</small></span></div>
            </div>
          </div>
        </section>

        <section className="trust-ribbon" aria-label="مزایای همکاری عمده">
          <span>قیمت مستقیم تولیدی</span><i /><span>استعلام موجودی روز</span><i /><span>مشاوره سفارش عمده</span><i /><span>ارسال به سراسر کشور</span>
        </section>

        <section className="first-product" id="products">
          <div className="section-heading">
            <div><span>نمونه کاتالوگ همکاری</span><h2>محصولات قابل تأمین عمده</h2></div>
            <Link href="/shop">مشاهده کاتالوگ عمده <Icon name="arrow" /></Link>
          </div>
          <article className="product-feature">
            <Link className="product-image" href={`/products/${featuredProduct.slug}`}>
              <Image src={featuredProduct.image} alt={featuredProduct.imageAlt} width={720} height={960} sizes="(max-width: 760px) 100vw, 45vw" unoptimized />
              <span>نمونه فعال</span>
            </Link>
            <div className="product-info">
              <small>پوشاک {featuredProduct.category}</small>
              <h3>{featuredProduct.name}</h3>
              <p>{featuredProduct.description}</p>
              <div>
                <strong>قیمت همکاری <small>{featuredProduct.price ?? "استعلام روز"}</small></strong>
                <Link href={`/products/${featuredProduct.slug}`}>جزئیات و استعلام</Link>
              </div>
            </div>
          </article>
        </section>

        <section className="categories" id="categories">
          <div className="section-heading categories-heading">
            <div><span>دسته‌بندی کاتالوگ عمده</span><h2>انتخاب محصول برای ویترین فروشگاه شما</h2></div>
            <p>مدل‌های ثبت‌شده را در سایت ببینید و برای دریافت موجودی کامل و قیمت روز با واحد فروش در ارتباط باشید.</p>
          </div>
          <div className="category-grid">
            <Link className="category-card women-card" href="/shop#catalog">
              <Image src="/images/products/57/white-model.webp" alt="پوشاک ورزشی زنانه میلنیوم" width={1086} height={1448} sizes="(max-width: 700px) 100vw, 33vw" unoptimized />
              <span className="category-shade" /><span className="category-number">01</span>
              <span className="category-copy"><small>مدل‌های قابل تأمین</small><strong>زنانه</strong><i><Icon name="arrow" /></i></span>
            </Link>
            <Link className="category-card men-card" href="/shop#catalog">
              <Image src="/images/hero-athlete.webp" alt="پوشاک ورزشی مردانه میلنیوم" width={720} height={900} sizes="(max-width: 700px) 100vw, 33vw" unoptimized />
              <span className="category-shade" /><span className="category-number">02</span>
              <span className="category-copy"><small>دریافت کاتالوگ روز</small><strong>مردانه</strong><i><Icon name="arrow" /></i></span>
            </Link>
            <Link className="category-card wholesale-card" href="/wholesale">
              <span className="wholesale-pattern" /><span className="category-number">03</span>
              <span className="category-copy"><small>قیمت تولیدی و هماهنگی مستقیم</small><strong>شرایط همکاری</strong><i><Icon name="arrow" /></i></span>
              <span className="bulk-badge">فروش فقط عمده</span>
            </Link>
          </div>
        </section>

        <section className="professional-values" aria-labelledby="why-title">
          <div className="pro-section-heading">
            <span>چرا میلنیوم اسپرت؟</span>
            <h2 id="why-title">همکاری عمده باید روشن، سریع و قابل پیگیری باشد.</h2>
            <p>اطلاعات قطعی هر سفارش پیش از نهایی‌شدن توسط واحد فروش تأیید می‌شود تا تصمیم‌گیری برای همکاران دقیق‌تر باشد.</p>
          </div>
          <div className="professional-values-grid">
            {benefits.map((benefit) => (
              <article key={benefit.title}><span><Icon name={benefit.icon} /></span><h3>{benefit.title}</h3><p>{benefit.text}</p></article>
            ))}
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="about-mark" aria-hidden="true">M</div>
          <div className="about-stats">
            <div><strong>۲۶</strong><span>سال تولید مستمر</span></div>
            <div><strong>۳۱</strong><span>استان تحت پوشش</span></div>
            <div><strong>۲</strong><span>نسل تجربه خانوادگی</span></div>
          </div>
          <div className="about-copy">
            <span>داستان میلنیوم اسپرت</span>
            <h2>دو نسل تجربه در تولید و پخش عمده پوشاک ورزشی.</h2>
            <p>پایه‌گذاری مجموعه به نسل پیشین خانواده و پدر آقای حسن اصلانی بازمی‌گردد. امروز مدیریت میلنیوم اسپرت بر عهده آقای حسن اصلانی است و مسیر خانوادگی مجموعه با تمرکز بر تولید و همکاری عمده ادامه دارد.</p>
            <Link href="/about">داستان و مسیر مجموعه <Icon name="arrow" /></Link>
          </div>
        </section>

        <section className="order-process" id="process" aria-labelledby="process-title">
          <div className="pro-section-heading pro-section-heading--center">
            <span>از انتخاب تا ارسال</span><h2 id="process-title">مراحل خرید عمده، قدم‌به‌قدم</h2>
            <p>برای شروع لازم نیست همه جزئیات سفارش مشخص باشد؛ واحد فروش در تکمیل درخواست همراه شماست.</p>
          </div>
          <ol className="order-steps">
            {steps.map(([number, title, text]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></li>)}
          </ol>
          <div className="process-action"><Link href="/quote">ثبت درخواست پیش‌فاکتور <Icon name="arrow" /></Link><Link href="/wholesale">مطالعه راهنمای کامل خرید عمده</Link></div>
        </section>

        <section className="bulk-section" id="bulk">
          <div className="bulk-visual"><span>WHOLESALE</span><div className="bulk-boxes"><i /><i /><i /></div></div>
          <div className="bulk-copy">
            <span>ویژه فروشگاه‌ها، پخش‌کننده‌ها و مجموعه‌ها</span>
            <h2>همکاری عمده، مستقیم با تولیدکننده</h2>
            <p>درخواست خود را ثبت کنید تا موجودی و قیمت روز متناسب با نیاز فروشگاه شما بررسی شود.</p>
            <ul><li>استعلام قیمت و موجودی روز</li><li>ثبت نیاز خرید در کمتر از دو دقیقه</li><li>هماهنگی مستقیم با واحد فروش</li></ul>
            <Link href="/quote">شروع درخواست خرید عمده <Icon name="arrow" /></Link>
          </div>
        </section>

        <section className="home-faq" aria-labelledby="home-faq-title">
          <div className="pro-section-heading"><span>پاسخ‌های کوتاه و شفاف</span><h2 id="home-faq-title">پیش از ثبت سفارش بدانید</h2></div>
          <div className="faq-list">
            <details><summary>آیا فروش تکی هم دارید؟</summary><p>تمرکز این سایت و فرایند سفارش آن فقط بر فروش عمده و همکاری با فروشگاه‌ها، پخش‌کننده‌ها و مجموعه‌های ورزشی است.</p></details>
            <details><summary>قیمت محصولات قطعی است؟</summary><p>قیمت اعلامی هر محصول در سایت نمایش داده می‌شود؛ بااین‌حال مبلغ نهایی و تعداد قابل تأمین هنگام ثبت سفارش توسط واحد فروش تأیید خواهد شد.</p></details>
            <details><summary>به شهرستان‌ها هم ارسال دارید؟</summary><p>بله، سفارش‌های عمده با هماهنگی واحد فروش برای همکاران سراسر ایران ارسال می‌شود.</p></details>
            <details><summary>چطور کاتالوگ کامل و موجودی روز را بگیرم؟</summary><p>از صفحه درخواست پیش‌فاکتور، مشخصات و نیاز خود را ثبت کنید و متن آماده‌شده را برای واحد فروش در تلگرام بفرستید.</p></details>
          </div>
          <Link className="faq-more" href="/wholesale#faq">مشاهده همه سؤال‌های متداول <Icon name="arrow" /></Link>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-intro">
            <span>حضوری یا آنلاین؛ کنار همکاران هستیم</span>
            <h2>واحد فروش عمده میلنیوم اسپرت</h2>
            <p>برای دریافت کاتالوگ، قیمت همکاری، موجودی روز یا هماهنگی مراجعه حضوری از مسیرهای رسمی مجموعه استفاده کنید.</p>
          </div>
          <div className="contact-grid">
            <a href="https://t.me/Millenniumsport" target="_blank" rel="noreferrer"><small>فروش عمده در تلگرام</small><strong dir="ltr">@Millenniumsport</strong><span>دریافت قیمت و موجودی روز</span></a>
            <a href="https://instagram.com/mill_spo0rt" target="_blank" rel="noreferrer"><small>اینستاگرام رسمی</small><strong dir="ltr">@mill_spo0rt</strong><span>مشاهده مدل‌های قابل تأمین</span></a>
            <Link href="/contact"><small>تماس و مراجعه حضوری</small><strong>مرکز خرید گردون، پلاک ۱۲۲</strong><span>جنب متروی نواب، تهران</span></Link>
          </div>
          <StoreMap compact />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
