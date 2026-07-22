"use client";

/* eslint-disable @next/next/no-img-element */

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { PublicStory } from "../lib/story-types";

type PanelState = "checking" | "login" | "ready" | "setup";

const OPTIMIZABLE_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function canvasToWebp(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
}

async function optimizeStoryImage(file: File): Promise<{ media: File; thumbnail?: File }> {
  if (!OPTIMIZABLE_IMAGE_TYPES.has(file.type) || typeof createImageBitmap !== "function") return { media: file };

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1080 / bitmap.width, 1920 / bitmap.height);
    const mainCanvas = document.createElement("canvas");
    mainCanvas.width = Math.max(1, Math.round(bitmap.width * scale));
    mainCanvas.height = Math.max(1, Math.round(bitmap.height * scale));

    const mainContext = mainCanvas.getContext("2d");
    const thumbnailCanvas = document.createElement("canvas");
    thumbnailCanvas.width = 160;
    thumbnailCanvas.height = 160;
    const thumbnailContext = thumbnailCanvas.getContext("2d");
    if (!mainContext || !thumbnailContext) {
      bitmap.close();
      return { media: file };
    }

    mainContext.drawImage(bitmap, 0, 0, mainCanvas.width, mainCanvas.height);

    const cropSize = Math.min(bitmap.width, bitmap.height);
    const cropX = Math.max(0, (bitmap.width - cropSize) / 2);
    const cropY = Math.max(0, (bitmap.height - cropSize) / 2);
    thumbnailContext.drawImage(bitmap, cropX, cropY, cropSize, cropSize, 0, 0, 160, 160);

    const [mainBlob, thumbnailBlob] = await Promise.all([
      canvasToWebp(mainCanvas, 0.82),
      canvasToWebp(thumbnailCanvas, 0.72),
    ]);
    bitmap.close();

    const baseName = file.name.replace(/\.[^.]+$/, "") || "story";
    const media = file.type !== "image/gif" && mainBlob && (scale < 1 || mainBlob.size < file.size)
      ? new File([mainBlob], `${baseName}.webp`, { type: "image/webp", lastModified: file.lastModified })
      : file;
    const thumbnail = thumbnailBlob
      ? new File([thumbnailBlob], `${baseName}-thumbnail.webp`, { type: "image/webp", lastModified: file.lastModified })
      : undefined;

    return { media, thumbnail };
  } catch {
    return { media: file };
  }
}

function remainingLabel(expiresAt: number, now: number) {
  const remaining = expiresAt - now;
  if (remaining <= 0) return "منقضی شده";
  const hours = Math.floor(remaining / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  return `${hours} ساعت و ${minutes} دقیقه باقی مانده`;
}

export default function StoryAdmin() {
  const [panelState, setPanelState] = useState<PanelState>("checking");
  const [stories, setStories] = useState<PublicStory[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(0);

  const loadStories = useCallback(async () => {
    const response = await fetch("/api/admin/stories", { cache: "no-store" });
    const payload = (await response.json().catch(() => ({}))) as { stories?: PublicStory[]; error?: string };
    if (response.status === 401) {
      setPanelState("login");
      return;
    }
    if (!response.ok) {
      setMessage(payload.error ?? "دریافت استوری‌ها ممکن نشد.");
      setPanelState(response.status === 503 ? "setup" : "ready");
      return;
    }
    setStories(payload.stories ?? []);
    setPanelState("ready");
  }, []);

  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" })
      .then(async (response) => ({ response, payload: await response.json().catch(() => ({})) as { authenticated?: boolean; configured?: boolean } }))
      .then(({ response, payload }) => {
        if (!payload.configured || response.status === 503) setPanelState("setup");
        else if (payload.authenticated) loadStories();
        else setPanelState("login");
      })
      .catch(() => {
        setMessage("ارتباط با پنل مدیریت برقرار نشد.");
        setPanelState("setup");
      });
  }, [loadStories]);

  useEffect(() => {
    const initial = window.setTimeout(() => setNow(Date.now()), 0);
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: form.get("password") }),
    });
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    if (response.ok) await loadStories();
    else setMessage(payload.error ?? "ورود انجام نشد.");
    setBusy(false);
  }

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const media = formData.get("media");
    if (media instanceof File && media.type.startsWith("image/")) {
      const optimized = await optimizeStoryImage(media);
      formData.set("media", optimized.media);
      if (optimized.thumbnail) formData.set("thumbnail", optimized.thumbnail);
    }
    const response = await fetch("/api/admin/stories", { method: "POST", body: formData });
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    if (response.ok) {
      form.reset();
      setMessage("استوری منتشر شد و ۲۴ ساعت نمایش داده می‌شود.");
      await loadStories();
    } else setMessage(payload.error ?? "انتشار استوری انجام نشد.");
    setBusy(false);
  }

  async function remove(id: string) {
    if (!window.confirm("این استوری همین حالا حذف شود؟")) return;
    setBusy(true);
    const response = await fetch(`/api/admin/stories/${encodeURIComponent(id)}`, { method: "DELETE" });
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    if (response.ok) {
      setStories((current) => current.filter((story) => story.id !== id));
      setMessage("استوری حذف شد.");
    } else setMessage(payload.error ?? "حذف استوری انجام نشد.");
    setBusy(false);
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setStories([]);
    setPanelState("login");
  }

  return (
    <main className="story-admin" id="main-content">
      <header className="story-admin__header">
        <Link href="/" className="story-admin__brand"><span>M</span><strong>میلنیوم اسپرت<small>مدیریت استوری‌های سایت</small></strong></Link>
        {panelState === "ready" ? <button type="button" onClick={logout}>خروج</button> : <Link href="/">بازگشت به سایت</Link>}
      </header>

      {panelState === "checking" ? <section className="story-admin__card"><p>در حال آماده‌سازی پنل…</p></section> : null}

      {panelState === "setup" ? (
        <section className="story-admin__card story-admin__setup">
          <span>نیاز به راه‌اندازی اولیه</span>
          <h1>پنل استوری هنوز به Cloudflare متصل نشده است.</h1>
          <p>{message || "پس از اتصال D1، R2 و ثبت رمز مدیریت، همین صفحه بدون تغییر کد فعال می‌شود."}</p>
        </section>
      ) : null}

      {panelState === "login" ? (
        <section className="story-admin__card story-admin__login">
          <span>ورود امن</span>
          <h1>مدیریت استوری‌های ۲۴ساعته</h1>
          <p>رمزی را وارد کنید که در Cloudflare برای پنل ثبت شده است.</p>
          <form onSubmit={login}>
            <label>رمز مدیریت<input name="password" type="password" autoComplete="current-password" required /></label>
            <button type="submit" disabled={busy}>{busy ? "در حال بررسی…" : "ورود به پنل"}</button>
          </form>
          {message ? <p className="story-admin__message story-admin__message--error">{message}</p> : null}
        </section>
      ) : null}

      {panelState === "ready" ? (
        <div className="story-admin__workspace">
          <section className="story-admin__card story-admin__composer">
            <span>استوری جدید</span>
            <h1>عکس یا ویدیو را منتشر کنید</h1>
            <p>استوری دقیقاً ۲۴ ساعت پس از انتشار از نوار سایت حذف می‌شود.</p>
            <form onSubmit={upload}>
              <label className="story-admin__upload">فایل استوری<input name="media" type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime" required /><small>عکس‌ها پیش از ارسال خودکار سبک می‌شوند؛ ویدیو حداکثر ۲۰ مگابایت</small></label>
              <div className="story-admin__fields">
                <label>عنوان کوتاه<input name="title" maxLength={80} placeholder="مثلاً رنگ‌بندی جدید" required /></label>
                <label>لینک محصول یا صفحه<input name="linkUrl" dir="ltr" placeholder="/products/... یا https://..." /></label>
                <label>متن دکمه<input name="buttonLabel" maxLength={28} placeholder="مشاهده محصول" /></label>
                <label>ترتیب نمایش<input name="sortOrder" type="number" defaultValue="0" /></label>
              </div>
              <button className="story-admin__publish" type="submit" disabled={busy}>{busy ? "در حال انتشار…" : "انتشار استوری برای ۲۴ ساعت"}</button>
            </form>
            {message ? <p className="story-admin__message">{message}</p> : null}
          </section>

          <section className="story-admin__card story-admin__list">
            <div className="story-admin__list-heading"><div><span>فهرست استوری‌ها</span><h2>{stories.filter((story) => story.expiresAt > now).length} استوری فعال</h2></div><button type="button" onClick={loadStories} disabled={busy}>به‌روزرسانی</button></div>
            {stories.length === 0 ? <p className="story-admin__empty">هنوز استوری‌ای منتشر نشده است.</p> : (
              <div className="story-admin__items">
                {stories.map((story) => (
                  <article key={story.id} className={story.expiresAt <= now ? "is-expired" : undefined}>
                    <div className="story-admin__preview">
                      {story.mediaType === "video" ? <video src={story.mediaUrl} muted playsInline preload="none" /> : <img src={story.thumbnailUrl} alt="" loading="lazy" decoding="async" />}
                    </div>
                    <div><strong>{story.title}</strong><small>{remainingLabel(story.expiresAt, now)}</small>{story.linkUrl ? <a href={story.linkUrl} target="_blank" rel="noreferrer">بازکردن لینک</a> : null}</div>
                    <button type="button" onClick={() => remove(story.id)} disabled={busy}>حذف</button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      ) : null}
    </main>
  );
}
