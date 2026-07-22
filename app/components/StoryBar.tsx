"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PublicStory } from "../lib/story-types";

const IMAGE_STORY_DURATION = 6_000;
const VIEWED_STORAGE_KEY = "millennium-viewed-stories";

function readViewedStories() {
  if (typeof window === "undefined") return new Set<string>();
  try {
    const value = JSON.parse(localStorage.getItem(VIEWED_STORAGE_KEY) ?? "[]") as unknown;
    return new Set(Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []);
  } catch {
    return new Set<string>();
  }
}

export default function StoryBar() {
  const [stories, setStories] = useState<PublicStory[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [viewed, setViewed] = useState<Set<string>>(new Set());
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const viewedTimer = window.setTimeout(() => setViewed(readViewedStories()), 0);
    const controller = new AbortController();

    fetch("/api/stories", { cache: "no-store", signal: controller.signal })
      .then(async (response) => (
        response.ok
          ? await response.json() as { stories?: PublicStory[] }
          : { stories: [] as PublicStory[] }
      ))
      .then((payload) => {
        const now = Date.now();
        setStories((payload.stories ?? []).filter((story) => story.expiresAt > now));
      })
      .catch(() => undefined);

    return () => {
      window.clearTimeout(viewedTimer);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (stories.length === 0) return;
    const nextExpiry = Math.min(...stories.map((story) => story.expiresAt));
    const delay = Math.max(100, Math.min(nextExpiry - Date.now() + 100, 2_147_000_000));
    const timer = window.setTimeout(() => {
      const now = Date.now();
      setStories((current) => current.filter((story) => story.expiresAt > now));
      setActiveIndex((current) => {
        if (current === null) return null;
        return current < stories.filter((story) => story.expiresAt > now).length ? current : null;
      });
    }, delay);
    return () => window.clearTimeout(timer);
  }, [stories]);

  const closeViewer = useCallback(() => {
    setActiveIndex(null);
    setProgress(0);
  }, []);

  const nextStory = useCallback(() => {
    setProgress(0);
    setActiveIndex((current) => {
      if (current === null) return null;
      if (current + 1 < stories.length) return current + 1;
      return null;
    });
  }, [stories.length]);

  const previousStory = useCallback(() => {
    setProgress(0);
    setActiveIndex((current) => {
      if (current === null) return null;
      return Math.max(0, current - 1);
    });
  }, []);

  const activeStory = activeIndex === null ? null : stories[activeIndex] ?? null;

  useEffect(() => {
    if (!activeStory) return;
    const viewedTimer = window.setTimeout(() => {
      setViewed((current) => {
        const next = new Set(current).add(activeStory.id);
        localStorage.setItem(VIEWED_STORAGE_KEY, JSON.stringify([...next].slice(-250)));
        return next;
      });
    }, 0);

    if (activeStory.mediaType === "video") {
      return () => window.clearTimeout(viewedTimer);
    }
    const startedAt = performance.now();
    let frame = 0;
    const tick = (time: number) => {
      const value = Math.min(1, (time - startedAt) / IMAGE_STORY_DURATION);
      setProgress(value);
      if (value >= 1) nextStory();
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      window.clearTimeout(viewedTimer);
      cancelAnimationFrame(frame);
    };
  }, [activeStory, nextStory]);

  useEffect(() => {
    if (!activeStory) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeViewer();
      if (event.key === "ArrowLeft") nextStory();
      if (event.key === "ArrowRight") previousStory();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeStory, closeViewer, nextStory, previousStory]);

  const progressItems = useMemo(
    () => stories.map((story, index) => ({ id: story.id, value: index < (activeIndex ?? 0) ? 1 : index === activeIndex ? progress : 0 })),
    [activeIndex, progress, stories],
  );

  if (stories.length === 0) return null;

  return (
    <>
      <section className="site-stories" aria-label="استوری‌های میلنیوم اسپرت">
        <div className="site-stories__inner">
          <div className="site-stories__heading">
            <strong>استوری‌های امروز</strong>
            <span>پس از ۲۴ ساعت حذف می‌شوند</span>
          </div>
          <div className="site-stories__rail">
            {stories.map((story, index) => (
              <button
                className={`story-bubble${viewed.has(story.id) ? " story-bubble--viewed" : ""}`}
                key={story.id}
                type="button"
                onClick={() => {
                  setProgress(0);
                  setActiveIndex(index);
                }}
                aria-label={`نمایش استوری ${story.title}`}
              >
                <span className="story-bubble__ring">
                  <span className="story-bubble__media">
                    {story.mediaType === "video" ? (
                      <span className="story-bubble__video" aria-hidden="true">▶</span>
                    ) : (
                      <img src={story.thumbnailUrl} alt="" loading="lazy" decoding="async" fetchPriority="low" />
                    )}
                  </span>
                </span>
                <span className="story-bubble__title">{story.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeStory ? (
        <div className="story-viewer" role="dialog" aria-modal="true" aria-label={activeStory.title} onMouseDown={(event) => event.target === event.currentTarget && closeViewer()}>
          <div className="story-viewer__panel">
            <div className="story-viewer__progress" aria-hidden="true">
              {progressItems.map((item) => <i key={item.id}><span style={{ width: `${item.value * 100}%` }} /></i>)}
            </div>
            <div className="story-viewer__topbar">
              <div>
                <span className="story-viewer__brand">M</span>
                <span><strong>میلنیوم اسپرت</strong><small>{activeStory.title}</small></span>
              </div>
              <button type="button" onClick={closeViewer} aria-label="بستن استوری">×</button>
            </div>

            <div className="story-viewer__media">
              {activeStory.mediaType === "video" ? (
                <video
                  key={activeStory.id}
                  ref={videoRef}
                  src={activeStory.mediaUrl}
                  autoPlay
                  playsInline
                  controls={false}
                  onLoadedMetadata={(event) => event.currentTarget.play().catch(() => undefined)}
                  onTimeUpdate={(event) => {
                    const video = event.currentTarget;
                    if (Number.isFinite(video.duration) && video.duration > 0) setProgress(video.currentTime / video.duration);
                  }}
                  onEnded={nextStory}
                />
              ) : (
                <img key={activeStory.id} src={activeStory.mediaUrl} alt={activeStory.title} />
              )}
            </div>

            <button className="story-viewer__tap story-viewer__tap--previous" type="button" onClick={previousStory} disabled={activeIndex === 0} aria-label="استوری قبلی" />
            <button className="story-viewer__tap story-viewer__tap--next" type="button" onClick={nextStory} aria-label="استوری بعدی" />

            {activeStory.linkUrl ? (
              <a
                className="story-viewer__cta"
                href={activeStory.linkUrl}
                target={activeStory.linkUrl.startsWith("https://") ? "_blank" : undefined}
                rel={activeStory.linkUrl.startsWith("https://") ? "noreferrer" : undefined}
              >
                {activeStory.buttonLabel || "مشاهده"}
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
