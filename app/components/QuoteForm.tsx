"use client";

import { FormEvent, useState } from "react";
import Icon from "./Icon";

const telegramUrl = "https://t.me/Millenniumsport";

const provinces = [
  "آذربایجان شرقی", "آذربایجان غربی", "اردبیل", "اصفهان", "البرز", "ایلام", "بوشهر", "تهران",
  "چهارمحال و بختیاری", "خراسان جنوبی", "خراسان رضوی", "خراسان شمالی", "خوزستان", "زنجان", "سمنان",
  "سیستان و بلوچستان", "فارس", "قزوین", "قم", "کردستان", "کرمان", "کرمانشاه", "کهگیلویه و بویراحمد",
  "گلستان", "گیلان", "لرستان", "مازندران", "مرکزی", "هرمزگان", "همدان", "یزد",
];

export default function QuoteForm({ initialProduct = "" }: { initialProduct?: string }) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const requestText = [
      "سلام، برای خرید عمده از میلنیوم اسپرت درخواست دارم.",
      `نام و نام خانوادگی: ${data.get("name")}`,
      `نام فروشگاه یا مجموعه: ${data.get("business")}`,
      `استان: ${data.get("province")}`,
      `شهر: ${data.get("city")}`,
      `شماره تماس: ${data.get("phone")}`,
      `محصول یا دسته موردنظر: ${data.get("product") || "نیاز به مشاوره دارم"}`,
      `تعداد تقریبی / توضیحات: ${data.get("details") || "—"}`,
    ].join("\n");

    setMessage(requestText);
    try {
      await navigator.clipboard.writeText(requestText);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  async function copyAgain() {
    try {
      await navigator.clipboard.writeText(message);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="quote-form-shell">
      <form className="quote-form" onSubmit={handleSubmit}>
        <div className="quote-form-heading">
          <span>کمتر از دو دقیقه</span>
          <h2>مشخصات درخواست همکاری</h2>
          <p>این فرم اطلاعات را روی سایت ذخیره یا ارسال نمی‌کند؛ در پایان متن آماده می‌شود تا خودتان در تلگرام برای واحد فروش بفرستید.</p>
        </div>

        <div className="form-grid">
          <label>
            <span>نام و نام خانوادگی *</span>
            <input name="name" autoComplete="name" required placeholder="مثلاً علی محمدی" />
          </label>
          <label>
            <span>نام فروشگاه یا مجموعه *</span>
            <input name="business" autoComplete="organization" required placeholder="نام واحد صنفی یا مجموعه" />
          </label>
          <label>
            <span>استان *</span>
            <select name="province" required defaultValue="">
              <option value="" disabled>انتخاب استان</option>
              {provinces.map((province) => <option key={province}>{province}</option>)}
            </select>
          </label>
          <label>
            <span>شهر *</span>
            <input name="city" autoComplete="address-level2" required placeholder="نام شهر" />
          </label>
          <label>
            <span>شماره تماس *</span>
            <input name="phone" type="tel" inputMode="tel" autoComplete="tel" required dir="ltr" placeholder="09xxxxxxxxx" />
          </label>
          <label>
            <span>محصول یا دسته موردنظر</span>
            <input name="product" defaultValue={initialProduct} placeholder="مثلاً پوشاک ورزشی زنانه" />
          </label>
          <label className="form-full">
            <span>تعداد تقریبی و توضیحات</span>
            <textarea name="details" rows={5} placeholder="تعداد تقریبی، سایزها، رنگ‌ها یا هر توضیحی که به استعلام دقیق‌تر کمک می‌کند…" />
          </label>
        </div>

        <button className="quote-submit" type="submit">ساخت و کپی متن درخواست <Icon name="copy" /></button>
        <small className="form-required-note">فیلدهای ستاره‌دار برای آماده‌سازی درخواست ضروری‌اند.</small>
      </form>

      <aside className={`quote-result${message ? " is-ready" : ""}`} aria-live="polite">
        {!message ? (
          <div className="quote-result-placeholder">
            <span><Icon name="send" size={28} /></span>
            <strong>متن درخواست شما اینجا آماده می‌شود.</strong>
            <p>پس از تکمیل فرم، متن را کپی و در گفت‌وگوی تلگرام میلنیوم اسپرت ارسال کنید.</p>
          </div>
        ) : (
          <>
            <span className="quote-ready-label"><Icon name="check" /> درخواست آماده است</span>
            <pre>{message}</pre>
            <div className="quote-result-actions">
              <button type="button" onClick={copyAgain}><Icon name="copy" /> کپی دوباره</button>
              <a href={telegramUrl} target="_blank" rel="noreferrer">رفتن به تلگرام <Icon name="send" /></a>
            </div>
            <p className={`copy-status ${status}`} role="status">
              {status === "copied" && "متن کپی شد؛ حالا آن را در تلگرام جای‌گذاری و ارسال کنید."}
              {status === "error" && "کپی خودکار در مرورگر شما ممکن نبود؛ متن بالا را دستی انتخاب و کپی کنید."}
            </p>
          </>
        )}
      </aside>
    </div>
  );
}

