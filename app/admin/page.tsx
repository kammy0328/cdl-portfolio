import type { Metadata } from "next";
import Admin from "@/components/admin/Admin";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <Admin />;
}
