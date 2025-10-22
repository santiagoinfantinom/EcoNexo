import { Metadata } from "next";
import { AdminPanel } from "@/components/AdminPanel";

export const metadata: Metadata = {
  title: "adminPageTitle",
  description: "adminPageDescription",
  robots: "noindex, nofollow", // No indexar página de admin
};

export default function AdminPage() {
  return <AdminPanel />;
}
