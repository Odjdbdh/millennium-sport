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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = images[selectedIndex];

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
          priority={selectedIndex === 0}
          sizes="(max-width: 800px) 100vw, 48vw"
        />
        <span>{status}</span>
        <small>{selected.label}</small>
      </div>
      <div className="product-gallery-thumbs" aria-label="انتخاب تصویر و رنگ محصول">
        {images.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            type="button"
            className={selectedIndex === index ? "active" : undefined}
            aria-pressed={selectedIndex === index}
            aria-label={`نمایش رنگ ${image.label}`}
            onClick={() => setSelectedIndex(index)}
          >
            <Image src={image.src} alt="" width={100} height={130} sizes="80px" unoptimized />
            <span>{image.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
