export const storeCoordinates = {
  latitude: "35.6942822",
  longitude: "51.3792333",
};

export const storeAddress =
  "تهران، پایین‌تر از میدان جمهوری، جنب متروی نواب، مرکز خرید گردون، طبقه همکف، پلاک ۱۲۲";

export const neshanUrl = `https://nshn.ir/?lat=${storeCoordinates.latitude}&lng=${storeCoordinates.longitude}`;
export const googleDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${storeCoordinates.latitude},${storeCoordinates.longitude}`;

const googleEmbedUrl = `https://www.google.com/maps?q=${storeCoordinates.latitude},${storeCoordinates.longitude}&z=16&output=embed`;

const PinIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export default function StoreMap({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`store-location${compact ? " store-location--compact" : ""}`} aria-label="موقعیت فروشگاه میلنیوم اسپرت">
      <div className="store-map-frame">
        <iframe
          src={googleEmbedUrl}
          title="موقعیت فروشگاه میلنیوم اسپرت روی نقشه"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          tabIndex={-1}
        />
        <a className="store-map-click" href={neshanUrl} aria-label="باز کردن موقعیت فروشگاه در نقشه نشان">
          <span><PinIcon /> بازکردن موقعیت در نشان</span>
        </a>
      </div>

      <div className="store-location-copy">
        <span>موقعیت فروشگاه</span>
        <h3>مراجعه حضوری همکاران</h3>
        <p>{storeAddress}</p>
        <div className="store-map-actions">
          <a className="neshan-map-button" href={neshanUrl}><PinIcon /> مسیریابی با نشان</a>
          <a className="google-map-button" href={googleDirectionsUrl} target="_blank" rel="noreferrer">مسیر جایگزین در گوگل‌مپ</a>
        </div>
        <small>مختصات فروشگاه: ۳۵٫۶۹۴۲۸۲۲، ۵۱٫۳۷۹۲۳۳۳</small>
      </div>
    </section>
  );
}
