"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { products as fallbackProducts, type Product } from "../data/products";
import type {
  Inquiry,
  InquiryStatus,
  ManagedProduct,
  MediaItem,
} from "../lib/admin-store";

type AdminSection =
  | "overview"
  | "products"
  | "orders"
  | "stories"
  | "customers"
  | "media"
  | "settings";
type GateState = "checking" | "login" | "setup" | "ready";

interface DashboardStats {
  products: number;
  newInquiries: number;
  customers: number;
  media: number;
  activeStories: number;
}

interface AdminStory {
  id: string;
  title: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  thumbnailUrl: string;
  linkUrl: string | null;
  buttonLabel: string | null;
  createdAt: number;
  expiresAt: number;
}

interface ProductDraft {
  id: string | null;
  slug: string;
  name: string;
  sku: string;
  categoryKey: Product["categoryKey"];
  status: Product["status"];
  price: string;
  pack: string;
  material: string;
  quality: string;
  sizes: string;
  colors: string;
  image: string;
  imageAlt: string;
  shortDescription: string;
  description: string;
  gallery: string;
  isActive: boolean;
}

const navItems: { key: AdminSection; label: string; icon: string }[] = [
  { key: "overview", label: "داشبورد", icon: "▦" },
  { key: "products", label: "محصولات", icon: "◇" },
  { key: "orders", label: "درخواست‌های خرید", icon: "▤" },
  { key: "stories", label: "استوری‌ها", icon: "◉" },
  { key: "customers", label: "مشتریان", icon: "♙" },
  { key: "media", label: "کتابخانه تصاویر", icon: "▧" },
  { key: "settings", label: "تنظیمات و امنیت", icon: "⚙" },
];

const statusLabels: Record<InquiryStatus, string> = {
  new: "جدید",
  contacted: "تماس گرفته شد",
  quoted: "پیش‌فاکتور",
  completed: "نهایی‌شده",
  cancelled: "لغوشده",
};

const emptyDraft: ProductDraft = {
  id: null,
  slug: "",
  name: "",
  sku: "",
  categoryKey: "women",
  status: "موجودی با استعلام",
  price: "",
  pack: "",
  material: "",
  quality: "A++++",
  sizes: "",
  colors: "",
  image: "",
  imageAlt: "",
  shortDescription: "",
  description: "",
  gallery: "",
  isActive: true,
};

const demoOrders: Inquiry[] = [
  {
    id: "demo-1",
    name: "مریم احمدی",
    business: "گالری ورزشی تهران",
    province: "تهران",
    city: "تهران",
    phone: "09120000000",
    product: "کراپ کیمونو کد ۱۱۲",
    details: "استعلام رنگ‌بندی و جین ۱۲ عددی",
    status: "new",
    createdAt: Date.now() - 42 * 60_000,
    updatedAt: Date.now() - 42 * 60_000,
  },
  {
    id: "demo-2",
    name: "علی رضایی",
    business: "پخش ورزشی پارس",
    province: "اصفهان",
    city: "اصفهان",
    phone: "09130000000",
    product: "لگ نایکی کد ۱۵۵",
    details: "قیمت همکاری برای ۲ جین",
    status: "contacted",
    createdAt: Date.now() - 4 * 3_600_000,
    updatedAt: Date.now() - 2 * 3_600_000,
  },
];

function toPersianNumber(value: number) {
  return value.toLocaleString("fa-IR");
}

function relativeTime(timestamp: number) {
  const difference = Math.max(0, Date.now() - timestamp);
  if (difference < 60_000) return "همین حالا";
  if (difference < 3_600_000) return `${toPersianNumber(Math.floor(difference / 60_000))} دقیقه پیش`;
  if (difference < 86_400_000) return `${toPersianNumber(Math.floor(difference / 3_600_000))} ساعت پیش`;
  return new Intl.DateTimeFormat("fa-IR", { month: "short", day: "numeric" }).format(timestamp);
}

function productToDraft(item: ManagedProduct): ProductDraft {
  const product = item.product;
  return {
    id: item.id,
    slug: product.slug,
    name: product.name,
    sku: product.sku ?? "",
    categoryKey: product.categoryKey,
    status: product.status,
    price: product.price ?? "",
    pack: product.pack ?? "",
    material: product.material ?? "",
    quality: product.quality ?? "",
    sizes: product.sizes.join("، "),
    colors: (product.colors ?? []).join("، "),
    image: product.image,
    imageAlt: product.imageAlt,
    shortDescription: product.shortDescription,
    description: product.description,
    gallery: (product.gallery ?? []).map((image) => image.src).join("\n"),
    isActive: item.isActive,
  };
}

function splitList(value: string) {
  return value.split(/[,،\n]/).map((item) => item.trim()).filter(Boolean);
}

function draftToProduct(draft: ProductDraft): Product {
  const categoryByKey: Record<Product["categoryKey"], Product["category"]> = {
    women: "زنانه",
    men: "مردانه",
    sets: "ست ورزشی",
  };
  const gallery = draft.gallery
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((src, index) => ({
      src,
      alt: `${draft.name} میلنیوم اسپرت`,
      label: `تصویر ${toPersianNumber(index + 1)}`,
    }));
  if (draft.image && !gallery.some((item) => item.src === draft.image)) {
    gallery.unshift({
      src: draft.image,
      alt: draft.imageAlt || `${draft.name} میلنیوم اسپرت`,
      label: "تصویر اصلی",
    });
  }
  return {
    slug: draft.slug || `product-${Date.now()}`,
    name: draft.name,
    category: categoryByKey[draft.categoryKey],
    categoryKey: draft.categoryKey,
    image: draft.image,
    imageAlt: draft.imageAlt || `${draft.name} میلنیوم اسپرت`,
    sizes: splitList(draft.sizes),
    colors: splitList(draft.colors),
    shortDescription: draft.shortDescription,
    description: draft.description,
    status: draft.status,
    gallery,
    ...(draft.sku ? { sku: draft.sku } : {}),
    ...(draft.price ? { price: draft.price } : {}),
    ...(draft.pack ? { pack: draft.pack } : {}),
    ...(draft.material ? { material: draft.material } : {}),
    ...(draft.quality ? { quality: draft.quality } : {}),
    salesTelegram: "https://t.me/Millenniumsport",
    phoneLabel: "۰۹۱۲۰۹۳۵۵۳۴",
    phoneHref: "tel:+989120935534",
  };
}

function apiMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object" && "error" in payload) {
    const error = (payload as { error?: unknown }).error;
    if (typeof error === "string") return error;
  }
  return fallback;
}

export default function AdminDashboard() {
  const [gate, setGate] = useState<GateState>("checking");
  const [section, setSection] = useState<AdminSection>("overview");
  const [navOpen, setNavOpen] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    newInquiries: 0,
    customers: 0,
    media: 0,
    activeStories: 0,
  });
  const [managedProducts, setManagedProducts] = useState<ManagedProduct[]>([]);
  const [orders, setOrders] = useState<Inquiry[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [stories, setStories] = useState<AdminStory[]>([]);
  const [productQuery, setProductQuery] = useState("");
  const [orderQuery, setOrderQuery] = useState("");
  const [draft, setDraft] = useState<ProductDraft | null>(null);
  const [storyNow, setStoryNow] = useState(() => Date.now());

  const notify = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3_500);
  }, []);

  const loadStories = useCallback(async () => {
    if (demoMode) return;
    const response = await fetch("/api/admin/stories", { cache: "no-store" });
    const payload = await response.json().catch(() => ({})) as { stories?: AdminStory[]; error?: string };
    if (response.ok) setStories(payload.stories ?? []);
  }, [demoMode]);

  const loadWorkspace = useCallback(async (asDemo = false) => {
    if (asDemo) {
      const now = Date.now();
      const products = fallbackProducts.map((product, index) => ({
        id: product.slug,
        product,
        isActive: true,
        createdAt: now - index * 86_400_000,
        updatedAt: now - index * 86_400_000,
      }));
      setManagedProducts(products);
      setOrders(demoOrders);
      setStats({
        products: products.length,
        newInquiries: 1,
        customers: 2,
        media: 28,
        activeStories: 3,
      });
      setStorageReady(true);
      setGate("ready");
      return;
    }

    setError("");
    const [overviewResponse, productsResponse, ordersResponse, mediaResponse] = await Promise.all([
      fetch("/api/admin/overview", { cache: "no-store" }),
      fetch("/api/admin/products", { cache: "no-store" }),
      fetch("/api/admin/orders", { cache: "no-store" }),
      fetch("/api/admin/media", { cache: "no-store" }),
    ]);
    if ([overviewResponse, productsResponse, ordersResponse, mediaResponse].some((response) => response.status === 401)) {
      setGate("login");
      return;
    }
    const [overviewPayload, productsPayload, ordersPayload, mediaPayload] = await Promise.all([
      overviewResponse.json().catch(() => ({})),
      productsResponse.json().catch(() => ({})),
      ordersResponse.json().catch(() => ({})),
      mediaResponse.json().catch(() => ({})),
    ]) as [
      { stats?: DashboardStats; error?: string },
      { products?: ManagedProduct[]; error?: string },
      { orders?: Inquiry[]; error?: string },
      { media?: MediaItem[]; error?: string },
    ];
    if (!overviewResponse.ok) {
      setError(apiMessage(overviewPayload, "دریافت اطلاعات پنل ممکن نشد."));
    }
    if (overviewPayload.stats) setStats(overviewPayload.stats);
    setManagedProducts(productsPayload.products ?? []);
    setOrders(ordersPayload.orders ?? []);
    setMedia(mediaPayload.media ?? []);
    setGate("ready");
    await loadStories();
  }, [loadStories]);

  useEffect(() => {
    const canUseDemo = process.env.NODE_ENV !== "production"
      && new URLSearchParams(window.location.search).get("demo") === "1";
    if (canUseDemo) {
      const timer = window.setTimeout(() => {
        setDemoMode(true);
        void loadWorkspace(true);
      }, 0);
      return () => window.clearTimeout(timer);
    }
    fetch("/api/admin/session", { cache: "no-store" })
      .then(async (response) => ({
        response,
        payload: await response.json().catch(() => ({})) as {
          authenticated?: boolean;
          configured?: boolean;
          storageReady?: boolean;
        },
      }))
      .then(({ response, payload }) => {
        setStorageReady(Boolean(payload.storageReady));
        if (!payload.configured || response.status === 503) setGate("setup");
        else if (payload.authenticated) void loadWorkspace();
        else setGate("login");
      })
      .catch(() => {
        setError("ارتباط با پنل مدیریت برقرار نشد.");
        setGate("setup");
      });
  }, [loadWorkspace]);

  useEffect(() => {
    const timer = window.setInterval(() => setStoryNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    const query = productQuery.trim().toLocaleLowerCase("fa");
    if (!query) return managedProducts;
    return managedProducts.filter(({ product }) =>
      `${product.name} ${product.sku ?? ""} ${product.category} ${(product.colors ?? []).join(" ")}`
        .toLocaleLowerCase("fa")
        .includes(query),
    );
  }, [managedProducts, productQuery]);

  const filteredOrders = useMemo(() => {
    const query = orderQuery.trim().toLocaleLowerCase("fa");
    if (!query) return orders;
    return orders.filter((order) =>
      `${order.name} ${order.business} ${order.phone} ${order.city} ${order.product}`
        .toLocaleLowerCase("fa")
        .includes(query),
    );
  }, [orderQuery, orders]);

  const customers = useMemo(() => {
    const unique = new Map<string, Inquiry>();
    for (const order of orders) if (!unique.has(order.phone)) unique.set(order.phone, order);
    return [...unique.values()];
  }, [orders]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: form.get("password") }),
    });
    const payload = await response.json().catch(() => ({}));
    if (response.ok) await loadWorkspace();
    else setError(apiMessage(payload, "ورود انجام نشد."));
    setBusy(false);
  }

  async function logout() {
    if (!demoMode) await fetch("/api/admin/session", { method: "DELETE" });
    setGate("login");
    setManagedProducts([]);
    setOrders([]);
    setMedia([]);
    setStories([]);
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    if (!draft.name.trim() || !draft.image.trim()) {
      setError("نام و تصویر اصلی محصول الزامی است.");
      return;
    }
    const normalizedDraft = {
      ...draft,
      slug: draft.slug.trim() || `product-${draft.sku.trim() || Date.now()}`,
    };
    const product = draftToProduct(normalizedDraft);
    setBusy(true);
    setError("");
    if (demoMode) {
      const now = Date.now();
      setManagedProducts((current) => {
        const existing = current.find((item) => item.id === normalizedDraft.id);
        if (existing) {
          return current.map((item) =>
            item.id === normalizedDraft.id
              ? { ...item, product, isActive: draft.isActive, updatedAt: now }
              : item,
          );
        }
        return [{
          id: product.slug,
          product,
          isActive: draft.isActive,
          createdAt: now,
          updatedAt: now,
        }, ...current];
      });
      setDraft(null);
      setBusy(false);
      notify("محصول در نسخه نمایشی ذخیره شد.");
      return;
    }
    const isEdit = Boolean(normalizedDraft.id);
    const response = await fetch(
      isEdit
        ? `/api/admin/products/${encodeURIComponent(normalizedDraft.id!)}`
        : "/api/admin/products",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, isActive: normalizedDraft.isActive }),
      },
    );
    const payload = await response.json().catch(() => ({}));
    if (response.ok) {
      setDraft(null);
      notify(isEdit ? "تغییرات محصول ذخیره شد." : "محصول جدید منتشر شد.");
      await loadWorkspace();
    } else {
      setError(apiMessage(payload, "ذخیره محصول ممکن نشد."));
    }
    setBusy(false);
  }

  async function archiveProduct(item: ManagedProduct) {
    if (!window.confirm(`محصول «${item.product.name}» از سایت غیرفعال شود؟`)) return;
    if (demoMode) {
      setManagedProducts((current) =>
        current.map((entry) => entry.id === item.id ? { ...entry, isActive: false } : entry),
      );
      notify("محصول غیرفعال شد.");
      return;
    }
    setBusy(true);
    const response = await fetch(`/api/admin/products/${encodeURIComponent(item.id)}`, {
      method: "DELETE",
    });
    const payload = await response.json().catch(() => ({}));
    if (response.ok) {
      setManagedProducts((current) =>
        current.map((entry) => entry.id === item.id ? { ...entry, isActive: false } : entry),
      );
      notify("محصول از کاتالوگ عمومی غیرفعال شد.");
    } else setError(apiMessage(payload, "غیرفعال‌کردن محصول ممکن نشد."));
    setBusy(false);
  }

  async function uploadMedia(file: File, applyToDraft = false) {
    if (demoMode) {
      const item: MediaItem = {
        id: `demo-${Date.now()}`,
        key: "demo",
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        createdAt: Date.now(),
      };
      setMedia((current) => [item, ...current]);
      if (applyToDraft) setDraft((current) => current ? { ...current, image: item.url } : current);
      notify("تصویر در نسخه نمایشی اضافه شد.");
      return;
    }
    setBusy(true);
    const form = new FormData();
    form.set("file", file);
    const response = await fetch("/api/admin/media", { method: "POST", body: form });
    const payload = await response.json().catch(() => ({})) as { media?: MediaItem; error?: string };
    if (response.ok && payload.media) {
      setMedia((current) => [payload.media!, ...current]);
      if (applyToDraft) {
        setDraft((current) => current ? { ...current, image: payload.media!.url } : current);
      }
      notify("تصویر با موفقیت بارگذاری شد.");
    } else setError(apiMessage(payload, "بارگذاری تصویر ممکن نشد."));
    setBusy(false);
  }

  async function changeOrderStatus(id: string, status: InquiryStatus) {
    if (demoMode) {
      setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order));
      notify("وضعیت درخواست تغییر کرد.");
      return;
    }
    const response = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const payload = await response.json().catch(() => ({}));
    if (response.ok) {
      setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order));
      notify("وضعیت درخواست ذخیره شد.");
    } else setError(apiMessage(payload, "تغییر وضعیت ممکن نشد."));
  }

  async function publishStory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (demoMode) {
      notify("انتشار استوری در حالت پیش‌نمایش غیرفعال است.");
      return;
    }
    setBusy(true);
    const form = event.currentTarget;
    const response = await fetch("/api/admin/stories", {
      method: "POST",
      body: new FormData(form),
    });
    const payload = await response.json().catch(() => ({}));
    if (response.ok) {
      form.reset();
      notify("استوری برای ۲۴ ساعت منتشر شد.");
      await loadStories();
    } else setError(apiMessage(payload, "انتشار استوری ممکن نشد."));
    setBusy(false);
  }

  async function removeStory(id: string) {
    if (!window.confirm("این استوری حذف شود؟")) return;
    const response = await fetch(`/api/admin/stories/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const payload = await response.json().catch(() => ({}));
    if (response.ok) {
      setStories((current) => current.filter((story) => story.id !== id));
      notify("استوری حذف شد.");
    } else setError(apiMessage(payload, "حذف استوری ممکن نشد."));
  }

  function changeSection(next: AdminSection) {
    setSection(next);
    setNavOpen(false);
    setError("");
  }

  if (gate === "checking") {
    return (
      <main className="admin-gate">
        <div className="admin-gate__loader"><i /><strong>در حال آماده‌سازی پنل مدیریت</strong><span>میلنیوم اسپرت</span></div>
      </main>
    );
  }

  if (gate === "setup") {
    return (
      <main className="admin-gate">
        <section className="admin-gate__card admin-gate__card--setup">
          <div className="admin-gate__logo">M</div>
          <span className="admin-kicker">راه‌اندازی یک‌باره امنیت</span>
          <h1>پنل ساخته شده؛ فقط رمز محرمانه باید در Cloudflare ثبت شود.</h1>
          <p>برای اینکه هیچ‌کس جز شما وارد نشود، رمز داخل کد یا GitHub قرار نمی‌گیرد. آن را به‌صورت Secret با نام <bdi>ADMIN_TOKEN</bdi> و حداقل ۱۶ کاراکتر در تنظیمات Worker ثبت کنید.</p>
          <div className="admin-gate__security">
            <span>✓ رمز در GitHub ذخیره نمی‌شود</span>
            <span>✓ نشست امن و HttpOnly</span>
            <span>✓ قفل ورود پس از تلاش ناموفق</span>
          </div>
          {error ? <p className="admin-alert admin-alert--error">{error}</p> : null}
          <div className="admin-gate__actions">
            <button type="button" onClick={() => window.location.reload()}>بررسی دوباره</button>
            <Link href="/">بازگشت به سایت</Link>
          </div>
        </section>
      </main>
    );
  }

  if (gate === "login") {
    return (
      <main className="admin-gate">
        <section className="admin-login">
          <div className="admin-login__visual">
            <div><span>پنل اختصاصی</span><h1>مدیریت میلنیوم اسپرت، یک‌جا و امن.</h1><p>محصولات، تصاویر، استوری‌ها و درخواست‌های خرید عمده را از موبایل یا دسکتاپ مدیریت کنید.</p></div>
            <small>دسترسی فقط برای مدیر سایت</small>
          </div>
          <div className="admin-login__form">
            <div className="admin-gate__logo">M</div>
            <span className="admin-kicker">ورود امن مدیریت</span>
            <h2>خوش آمدید</h2>
            <p>رمز اختصاصی ثبت‌شده در Cloudflare را وارد کنید.</p>
            <form onSubmit={login}>
              <label>رمز مدیریت<input name="password" type="password" autoComplete="current-password" minLength={16} required autoFocus /></label>
              <button type="submit" disabled={busy}>{busy ? "در حال بررسی…" : "ورود به پنل مدیریت"}</button>
            </form>
            {error ? <p className="admin-alert admin-alert--error">{error}</p> : null}
            <Link href="/">← بازگشت به سایت اصلی</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="admin-app">
      <aside className={`admin-sidebar${navOpen ? " is-open" : ""}`}>
        <div className="admin-sidebar__brand">
          <span>M</span>
          <strong>میلنیوم اسپرت<small>پنل مدیریت سایت</small></strong>
          <button type="button" onClick={() => setNavOpen(false)} aria-label="بستن منو">×</button>
        </div>
        <nav aria-label="بخش‌های پنل مدیریت">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={section === item.key ? "is-active" : undefined}
              onClick={() => changeSection(item.key)}
            >
              <i>{item.icon}</i><span>{item.label}</span>
              {item.key === "orders" && stats.newInquiries > 0 ? <b>{toPersianNumber(stats.newInquiries)}</b> : null}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar__foot">
          <div><i className={storageReady ? "is-online" : ""} /><span><strong>{storageReady ? "همه‌چیز متصل است" : "نیاز به بررسی اتصال"}</strong><small>Cloudflare Worker</small></span></div>
          <button type="button" onClick={logout}>خروج امن</button>
        </div>
      </aside>
      {navOpen ? <button className="admin-nav-backdrop" type="button" onClick={() => setNavOpen(false)} aria-label="بستن منو" /> : null}

      <main className="admin-main">
        <header className="admin-topbar">
          <button className="admin-menu-button" type="button" onClick={() => setNavOpen(true)} aria-label="بازکردن منو">☰</button>
          <div>
            <span>{new Intl.DateTimeFormat("fa-IR", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}</span>
            <strong>{navItems.find((item) => item.key === section)?.label}</strong>
          </div>
          <div className="admin-topbar__actions">
            <Link href="/" target="_blank">مشاهده سایت ↗</Link>
            <button type="button" onClick={() => setDraft({ ...emptyDraft })}>+ محصول جدید</button>
          </div>
        </header>

        {!storageReady ? <div className="admin-connect-warning"><strong>اتصال ذخیره‌سازی کامل نیست.</strong><span>پس از اولین انتشار جدید، D1 و R2 به‌صورت خودکار ساخته می‌شوند.</span></div> : null}
        {error ? <div className="admin-alert admin-alert--error"><span>{error}</span><button type="button" onClick={() => setError("")}>×</button></div> : null}

        <div className="admin-content">
          {section === "overview" ? (
            <>
              <section className="admin-welcome">
                <div><span className="admin-kicker">مرکز کنترل فروش عمده</span><h1>همه‌چیز برای مدیریت روزانه آماده است.</h1><p>محصولات و تصاویر را به‌روز کنید، درخواست‌های همکاران را پیگیری کنید و استوری‌های ۲۴ساعته منتشر کنید.</p></div>
                <button type="button" onClick={() => setDraft({ ...emptyDraft })}>افزودن محصول جدید <span>←</span></button>
              </section>

              <section className="admin-stats" aria-label="آمار پنل">
                <article><span>محصولات فعال</span><strong>{toPersianNumber(stats.products)}</strong><small>نمایش در کاتالوگ</small><i>◇</i></article>
                <article className="is-red"><span>درخواست‌های جدید</span><strong>{toPersianNumber(stats.newInquiries)}</strong><small>نیازمند پیگیری</small><i>▤</i></article>
                <article><span>مشتریان ثبت‌شده</span><strong>{toPersianNumber(stats.customers)}</strong><small>شماره تماس یکتا</small><i>♙</i></article>
                <article><span>استوری فعال</span><strong>{toPersianNumber(stats.activeStories)}</strong><small>نمایش در سایت</small><i>◉</i></article>
              </section>

              <div className="admin-overview-grid">
                <section className="admin-panel">
                  <div className="admin-panel__heading"><div><span>آخرین درخواست‌ها</span><h2>پیگیری فروش عمده</h2></div><button type="button" onClick={() => changeSection("orders")}>مشاهده همه</button></div>
                  <div className="admin-order-mini-list">
                    {orders.slice(0, 5).map((order) => (
                      <article key={order.id}>
                        <span className="admin-avatar">{order.name.slice(0, 1)}</span>
                        <div><strong>{order.business}</strong><small>{order.product || "نیاز به مشاوره"} · {order.city}</small></div>
                        <span className={`admin-status admin-status--${order.status}`}>{statusLabels[order.status]}</span>
                        <time>{relativeTime(order.createdAt)}</time>
                      </article>
                    ))}
                    {orders.length === 0 ? <div className="admin-empty"><span>▤</span><strong>درخواستی ثبت نشده است.</strong><p>درخواست‌های فرم همکاری اینجا نمایش داده می‌شوند.</p></div> : null}
                  </div>
                </section>

                <section className="admin-panel admin-quick">
                  <div className="admin-panel__heading"><div><span>دسترسی سریع</span><h2>کارهای پرتکرار</h2></div></div>
                  <button type="button" onClick={() => setDraft({ ...emptyDraft })}><i>＋</i><span><strong>محصول جدید</strong><small>مشخصات، قیمت و عکس</small></span><b>←</b></button>
                  <button type="button" onClick={() => changeSection("stories")}><i>◉</i><span><strong>انتشار استوری</strong><small>عکس یا ویدیو برای ۲۴ ساعت</small></span><b>←</b></button>
                  <button type="button" onClick={() => changeSection("media")}><i>▧</i><span><strong>بارگذاری تصویر</strong><small>کتابخانه تصاویر محصولات</small></span><b>←</b></button>
                  <button type="button" onClick={() => changeSection("orders")}><i>▤</i><span><strong>پیگیری درخواست‌ها</strong><small>{toPersianNumber(stats.newInquiries)} درخواست جدید</small></span><b>←</b></button>
                </section>
              </div>
            </>
          ) : null}

          {section === "products" ? (
            <section className="admin-panel admin-products">
              <div className="admin-section-head">
                <div><span className="admin-kicker">کاتالوگ فروش عمده</span><h1>مدیریت محصولات</h1><p>قیمت، رنگ‌بندی، سایز، تصاویر و وضعیت نمایش محصول را تغییر دهید.</p></div>
                <button type="button" onClick={() => setDraft({ ...emptyDraft })}>+ افزودن محصول</button>
              </div>
              <div className="admin-toolbar">
                <label><span>⌕</span><input type="search" value={productQuery} onChange={(event) => setProductQuery(event.target.value)} placeholder="جست‌وجوی نام، کد یا رنگ محصول…" /></label>
                <span>{toPersianNumber(filteredProducts.length)} محصول</span>
              </div>
              <div className="admin-product-table">
                <div className="admin-product-table__head"><span>محصول</span><span>کد / دسته</span><span>قیمت همکاری</span><span>وضعیت</span><span>عملیات</span></div>
                {filteredProducts.map((item) => (
                  <article key={item.id}>
                    <div className="admin-product-title"><img src={item.product.image} alt="" /><span><strong>{item.product.name}</strong><small>{(item.product.colors ?? []).slice(0, 4).join("، ") || "بدون رنگ‌بندی"}</small></span></div>
                    <div><strong>{item.product.sku ? `کد ${item.product.sku}` : "بدون کد"}</strong><small>{item.product.category}</small></div>
                    <div><strong>{item.product.price ?? "استعلام روز"}</strong><small>{item.product.pack ?? "جین با استعلام"}</small></div>
                    <div><span className={`admin-product-state${item.isActive ? " is-active" : ""}`}>{item.isActive ? item.product.status : "غیرفعال"}</span></div>
                    <div className="admin-row-actions"><button type="button" onClick={() => setDraft(productToDraft(item))}>ویرایش</button><button type="button" onClick={() => archiveProduct(item)} disabled={!item.isActive}>غیرفعال</button></div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {section === "orders" ? (
            <section className="admin-panel admin-orders">
              <div className="admin-section-head">
                <div><span className="admin-kicker">سرنخ‌های فروش</span><h1>درخواست‌های خرید عمده</h1><p>درخواست‌های ثبت‌شده در فرم سایت را پیگیری و مرحله فروش را به‌روزرسانی کنید.</p></div>
              </div>
              <div className="admin-toolbar">
                <label><span>⌕</span><input type="search" value={orderQuery} onChange={(event) => setOrderQuery(event.target.value)} placeholder="جست‌وجوی مشتری، فروشگاه، شهر یا شماره…" /></label>
                <span>{toPersianNumber(filteredOrders.length)} درخواست</span>
              </div>
              <div className="admin-orders-list">
                {filteredOrders.map((order) => (
                  <article key={order.id}>
                    <div className="admin-order-person"><span className="admin-avatar">{order.name.slice(0, 1)}</span><div><strong>{order.name}</strong><small>{order.business}</small></div></div>
                    <div className="admin-order-contact"><a href={`tel:${order.phone}`} dir="ltr">{order.phone}</a><small>{order.province}، {order.city}</small></div>
                    <div className="admin-order-request"><strong>{order.product || "نیاز به مشاوره"}</strong><small>{order.details || "بدون توضیحات"}</small></div>
                    <div><select value={order.status} onChange={(event) => changeOrderStatus(order.id, event.target.value as InquiryStatus)}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><time>{relativeTime(order.createdAt)}</time></div>
                  </article>
                ))}
                {filteredOrders.length === 0 ? <div className="admin-empty"><span>▤</span><strong>درخواستی پیدا نشد.</strong><p>با ثبت اولین فرم همکاری، اطلاعات اینجا قرار می‌گیرد.</p></div> : null}
              </div>
            </section>
          ) : null}

          {section === "stories" ? (
            <div className="admin-stories-grid">
              <section className="admin-panel admin-story-composer">
                <span className="admin-kicker">استوری جدید</span><h1>انتشار عکس یا ویدیو</h1><p>استوری دقیقاً ۲۴ ساعت پس از انتشار از بالای سایت حذف می‌شود.</p>
                <form onSubmit={publishStory}>
                  <label className="admin-file-drop"><input name="media" type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime" required /><i>＋</i><strong>انتخاب عکس یا ویدیو</strong><small>عکس حداکثر ۸ و ویدیو حداکثر ۲۰ مگابایت</small></label>
                  <label>عنوان کوتاه<input name="title" maxLength={80} required placeholder="مثلاً رنگ‌بندی جدید رسید" /></label>
                  <div><label>لینک مقصد<input name="linkUrl" dir="ltr" placeholder="/products/... یا https://..." /></label><label>متن دکمه<input name="buttonLabel" maxLength={28} placeholder="مشاهده محصول" /></label></div>
                  <button type="submit" disabled={busy}>انتشار برای ۲۴ ساعت</button>
                </form>
              </section>
              <section className="admin-panel admin-story-list">
                <div className="admin-panel__heading"><div><span>استوری‌های سایت</span><h2>{toPersianNumber(stories.filter((story) => story.expiresAt > storyNow).length)} استوری فعال</h2></div><button type="button" onClick={loadStories}>به‌روزرسانی</button></div>
                <div>
                  {stories.map((story) => (
                    <article key={story.id} className={story.expiresAt <= storyNow ? "is-expired" : undefined}>
                      <div>{story.mediaType === "video" ? <video src={story.mediaUrl} muted preload="none" /> : <img src={story.thumbnailUrl} alt="" />}</div>
                      <span><strong>{story.title}</strong><small>{story.expiresAt <= storyNow ? "منقضی‌شده" : `${toPersianNumber(Math.max(0, Math.floor((story.expiresAt - storyNow) / 3_600_000)))} ساعت باقی‌مانده`}</small></span>
                      <button type="button" onClick={() => removeStory(story.id)}>حذف</button>
                    </article>
                  ))}
                  {stories.length === 0 ? <div className="admin-empty"><span>◉</span><strong>استوری فعالی ندارید.</strong><p>اولین عکس یا ویدیو را از فرم کناری منتشر کنید.</p></div> : null}
                </div>
              </section>
            </div>
          ) : null}

          {section === "customers" ? (
            <section className="admin-panel admin-customers">
              <div className="admin-section-head"><div><span className="admin-kicker">دفتر مشتریان</span><h1>فروشگاه‌ها و همکاران</h1><p>این فهرست به‌صورت خودکار از درخواست‌های خرید ساخته می‌شود.</p></div></div>
              <div className="admin-customer-grid">
                {customers.map((customer) => (
                  <article key={customer.phone}>
                    <span className="admin-avatar">{customer.business.slice(0, 1)}</span>
                    <div><strong>{customer.business}</strong><small>{customer.name} · {customer.city}</small></div>
                    <a href={`tel:${customer.phone}`} dir="ltr">{customer.phone}</a>
                  </article>
                ))}
                {customers.length === 0 ? <div className="admin-empty"><span>♙</span><strong>مشتری ثبت‌شده‌ای ندارید.</strong></div> : null}
              </div>
            </section>
          ) : null}

          {section === "media" ? (
            <section className="admin-panel admin-media">
              <div className="admin-section-head">
                <div><span className="admin-kicker">فضای تصاویر</span><h1>کتابخانه رسانه</h1><p>تصاویر بارگذاری‌شده را در محصولات مختلف استفاده کنید.</p></div>
                <label className="admin-upload-button">+ بارگذاری تصویر<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadMedia(file); event.currentTarget.value = ""; }} /></label>
              </div>
              <div className="admin-media-grid">
                {media.map((item) => (
                  <article key={item.id}>
                    <img src={item.url} alt={item.filename} />
                    <div><strong title={item.filename}>{item.filename}</strong><small>{(item.size / 1024).toLocaleString("fa-IR", { maximumFractionDigits: 0 })} کیلوبایت</small></div>
                    <button type="button" onClick={() => { void navigator.clipboard.writeText(item.url); notify("آدرس تصویر کپی شد."); }}>کپی آدرس</button>
                  </article>
                ))}
                {media.length === 0 ? <div className="admin-empty"><span>▧</span><strong>هنوز تصویری بارگذاری نشده است.</strong><p>تصاویر فعلی سایت همچنان در محصولات نمایش داده می‌شوند.</p></div> : null}
              </div>
            </section>
          ) : null}

          {section === "settings" ? (
            <div className="admin-settings-grid">
              <section className="admin-panel">
                <span className="admin-kicker">وضعیت سیستم</span><h1>امنیت و اتصال‌ها</h1>
                <div className="admin-health-list">
                  <div><i className="is-ok">✓</i><span><strong>ورود محافظت‌شده</strong><small>نشست رمزنگاری‌شده و HttpOnly</small></span><b>فعال</b></div>
                  <div><i className={storageReady ? "is-ok" : "is-warn"}>{storageReady ? "✓" : "!"}</i><span><strong>دیتابیس محصولات و سفارش‌ها</strong><small>Cloudflare D1</small></span><b>{storageReady ? "متصل" : "در انتظار"}</b></div>
                  <div><i className={storageReady ? "is-ok" : "is-warn"}>{storageReady ? "✓" : "!"}</i><span><strong>فضای تصاویر و استوری</strong><small>Cloudflare R2</small></span><b>{storageReady ? "متصل" : "در انتظار"}</b></div>
                  <div><i className="is-ok">✓</i><span><strong>انتشار خودکار</strong><small>GitHub → Cloudflare Worker</small></span><b>فعال</b></div>
                </div>
              </section>
              <section className="admin-panel admin-security-note">
                <span>نکته امنیتی</span><h2>رمز مدیریت را فقط در Cloudflare تغییر دهید.</h2><p>رمز هیچ‌وقت داخل سایت یا GitHub ذخیره نمی‌شود. برای امنیت بیشتر، رمزی طولانی و متفاوت از رمزهای دیگر انتخاب کنید.</p>
                <ul><li>حداقل ۱۶ کاراکتر</li><li>ترکیب حروف، عدد و نماد</li><li>عدم ارسال رمز در پیام‌رسان</li></ul>
              </section>
            </div>
          ) : null}
        </div>
      </main>

      {draft ? (
        <div className="admin-modal" role="dialog" aria-modal="true" aria-label={draft.id ? "ویرایش محصول" : "افزودن محصول"}>
          <button className="admin-modal__backdrop" type="button" onClick={() => setDraft(null)} aria-label="بستن فرم" />
          <form className="admin-product-form" onSubmit={saveProduct}>
            <header><div><span>{draft.id ? "ویرایش محصول" : "محصول جدید"}</span><h2>{draft.id ? draft.name : "افزودن به کاتالوگ"}</h2></div><button type="button" onClick={() => setDraft(null)}>×</button></header>
            <div className="admin-product-form__body">
              <section>
                <h3>اطلاعات اصلی</h3>
                <div className="admin-form-grid">
                  <label className="is-wide">نام محصول *<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required /></label>
                  <label>کد محصول<input value={draft.sku} onChange={(event) => setDraft({ ...draft, sku: event.target.value })} dir="ltr" /></label>
                  <label>شناسه انگلیسی *<input value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} dir="ltr" readOnly={Boolean(draft.id)} placeholder="product-112" required /></label>
                  <label>دسته‌بندی<select value={draft.categoryKey} onChange={(event) => setDraft({ ...draft, categoryKey: event.target.value as Product["categoryKey"] })}><option value="women">زنانه</option><option value="men">مردانه</option><option value="sets">ست ورزشی</option></select></label>
                  <label>وضعیت<select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as Product["status"] })}><option>موجودی با استعلام</option><option>موجود</option><option>ناموجود</option><option>در حال تولید</option></select></label>
                  <label>قیمت همکاری<input value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} placeholder="مثلاً ۶۴۰ هزار تومان" /></label>
                  <label>نوع جین / بسته‌بندی<input value={draft.pack} onChange={(event) => setDraft({ ...draft, pack: event.target.value })} /></label>
                  <label>جنس پارچه<input value={draft.material} onChange={(event) => setDraft({ ...draft, material: event.target.value })} /></label>
                  <label>درجه کیفیت<input value={draft.quality} onChange={(event) => setDraft({ ...draft, quality: event.target.value })} dir="ltr" /></label>
                  <label className="is-wide">سایزها<input value={draft.sizes} onChange={(event) => setDraft({ ...draft, sizes: event.target.value })} placeholder="L، XL، مناسب ۳۸ تا ۴۴" /></label>
                  <label className="is-wide">رنگ‌بندی<input value={draft.colors} onChange={(event) => setDraft({ ...draft, colors: event.target.value })} placeholder="مشکی، سفید، زیتونی…" /></label>
                  <label className="is-wide">توضیح کوتاه<textarea rows={2} value={draft.shortDescription} onChange={(event) => setDraft({ ...draft, shortDescription: event.target.value })} /></label>
                  <label className="is-wide">توضیحات کامل<textarea rows={5} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label>
                </div>
              </section>
              <section>
                <h3>تصاویر محصول</h3>
                <div className="admin-product-image-field">
                  <div>{draft.image ? <img src={draft.image} alt="" /> : <span>بدون تصویر</span>}</div>
                  <label>بارگذاری تصویر اصلی<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadMedia(file, true); event.currentTarget.value = ""; }} /></label>
                </div>
                <label className="admin-block-label">یا آدرس تصویر اصلی<input value={draft.image} onChange={(event) => setDraft({ ...draft, image: event.target.value })} dir="ltr" placeholder="/images/... یا تصویر بارگذاری‌شده" required /></label>
                <label className="admin-block-label">متن جایگزین تصویر<input value={draft.imageAlt} onChange={(event) => setDraft({ ...draft, imageAlt: event.target.value })} /></label>
                <label className="admin-block-label">تصاویر گالری؛ هر آدرس در یک خط<textarea rows={8} value={draft.gallery} onChange={(event) => setDraft({ ...draft, gallery: event.target.value })} dir="ltr" /></label>
                <label className="admin-active-toggle"><input type="checkbox" checked={draft.isActive} onChange={(event) => setDraft({ ...draft, isActive: event.target.checked })} /><span><strong>نمایش در سایت</strong><small>با غیرفعال‌کردن، محصول از کاتالوگ عمومی پنهان می‌شود.</small></span></label>
              </section>
            </div>
            <footer><button type="button" onClick={() => setDraft(null)}>انصراف</button><button type="submit" disabled={busy}>{busy ? "در حال ذخیره…" : draft.id ? "ذخیره تغییرات" : "انتشار محصول"}</button></footer>
          </form>
        </div>
      ) : null}

      {toast ? <div className="admin-toast"><span>✓</span>{toast}</div> : null}
    </div>
  );
}
