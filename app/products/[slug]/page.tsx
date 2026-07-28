import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "../../components/Icon";
import ProductGallery from "../../components/ProductGallery";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import { products } from "../../data/products";
import { getCatalogProduct } from "../../lib/catalog";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.shortDescription} مشاهده جزئیات و درخواست قیمت همکاری روز از میلنیوم اسپرت.`,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { images: [{ url: product.image, width: 960, height: 1280, alt: product.imageAlt }] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!product) notFound();

  const productData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: (product.gallery ?? [{ src: product.image }]).map((image) => `https://millenniumsport.ir${image.src}`),
    description: product.description,
    brand: { "@type": "Brand", name: "میلنیوم اسپرت" },
    category: `پوشاک ورزشی ${product.category}`,
    ...(product.sku ? { sku: product.sku } : {}),
    ...(product.material ? { material: product.material } : {}),
    ...(product.colors ? { color: product.colors.join("، ") } : {}),
  };

  const gallery = product.gallery ?? [{ src: product.image, alt: product.imageAlt, label: "تصویر محصول" }];

  return (
    <div className="pro-page product-page">
      <SiteHeader active="shop" />
      <main id="main-content">
        <nav className="breadcrumbs" aria-label="مسیر صفحه"><Link href="/">خانه</Link><span>/</span><Link href="/shop">کاتالوگ</Link><span>/</span><span aria-current="page">{product.name}</span></nav>
        <section className="product-detail">
          <ProductGallery images={gallery} status={product.status} />
          <div className="product-detail-copy">
            <span className="product-category">پوشاک ورزشی {product.category}{product.sku ? <> · کد محصول <bdi>{product.sku}</bdi></> : null}</span>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <div className="product-price"><small>قیمت همکاری</small><strong>{product.price ?? "استعلام روز"}</strong><span>قیمت و موجودی نهایی پیش از سفارش تأیید می‌شود</span></div>
            <div className="product-specs">
              <div><small>سایزهای ثبت‌شده</small><strong>{product.sizes.join("، ")}</strong></div>
              {product.material ? <div><small>جنس کالا</small><strong>{product.material}</strong></div> : null}
              {product.pack ? <div><small>بسته‌بندی عمده</small><strong>{product.pack}</strong></div> : null}
              {product.quality ? <div><small>درجه کیفیت</small><strong dir="ltr">{product.quality}</strong></div> : null}
              {product.colors ? <div className="product-colors-spec"><small>رنگ‌بندی</small><strong>{product.colors.join("، ")}</strong></div> : null}
              <div><small>نوع فروش</small><strong>فقط عمده و همکاری</strong></div>
              <div><small>رنگ و موجودی</small><strong>تأیید هنگام استعلام</strong></div>
            </div>
            <div className="product-detail-actions"><Link href={`/quote?product=${encodeURIComponent(`${product.name} - کد ${product.sku ?? ""}`)}`}>درخواست خرید عمده <Icon name="arrow" /></Link><a href={product.salesTelegram ?? "https://t.me/Millenniumsport"} target="_blank" rel="noreferrer">گفت‌وگو با ادمین</a></div>
            {product.phoneHref ? <div className="product-phone"><span>تماس با واحد فروش</span><a href={product.phoneHref} dir="ltr">{product.phoneLabel}</a></div> : null}
            <div className="product-honesty-note"><Icon name="check" /><p>برای جلوگیری از اطلاعات قدیمی، تعداد، رنگ‌بندی و قیمت قطعی پیش از سفارش توسط واحد فروش اعلام می‌شود.</p></div>
          </div>
        </section>
        <section className="product-buying-guide"><div><span>برای استعلام سریع‌تر</span><h2>نام محصول، تعداد تقریبی و شهر خود را ارسال کنید.</h2></div><Link href="/wholesale#process">مراحل کامل خرید عمده <Icon name="arrow" /></Link></section>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productData) }} />
      </main>
      <SiteFooter />
    </div>
  );
}
