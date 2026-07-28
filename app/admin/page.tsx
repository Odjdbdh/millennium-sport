import type { Metadata } from "next";
import AdminDashboard from "../components/AdminDashboard";

export const metadata: Metadata = {
  title: "پنل مدیریت",
  robots: { index: false, follow: false, noarchive: true },
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <AdminDashboard />;
}
