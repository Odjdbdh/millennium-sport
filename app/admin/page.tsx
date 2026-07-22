import type { Metadata } from "next";
import StoryAdmin from "../components/StoryAdmin";

export const metadata: Metadata = {
  title: "مدیریت استوری‌ها",
  robots: { index: false, follow: false },
};

export default function StoryAdminPage() {
  return <StoryAdmin />;
}
