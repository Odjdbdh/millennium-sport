"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductGalleryImage } from "../data/products";

export default function ProductGallery({
  images,
  status,
}: {
  images: ProductGalleryImage[];
  status: string;
}) {
  const safeImages = images.length > 0 ? images : [{ src: "/images/millennium-logo-social.webp", alt: "میلنیوم اسپرت", label: "تصویر محصول" }];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = safeImages[Math.min(selectedIndex, safeImages.length - 1)];

  return (
    <div className="product-gallery">
      <div className="product-detail-image">
        <Image
          key={selected.src}
          src={selected.src}
          alt={selected.alt}
          width={900}
          height={1350}
          unoptimized
          priority
          sizes="(max-width: 800px) 100vw, 48vw"
        />
        <span>{status}</span>
        <small>{selected.label}</small>
      </div>
      <div className="product-gallery-thumbs" aria-label={`گالری محصول؛ ${safeImages.length.toLocaleString("fa-IR")} تصویر`}>
        {safeImages.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            type="button"
            className={selectedIndex === index ? "active" : undefined}
            aria-pressed={selectedIndex === index}
            aria-label={`نمایش ${image.label}`}
            onClick={() => setSelectedIndex(index)}
          >
            <Image src={image.src} alt="" width={100} height={130} sizes="80px" unoptimized />
            <span>{image.label}</span>
          </button>
        ))}
      </div>
      <p className="product-gallery-hint" aria-live="polite">برای دیدن رنگ‌ها و نماهای بیشتر، تصاویر گالری را انتخاب کنید.</p>
    </div>
  );
}
