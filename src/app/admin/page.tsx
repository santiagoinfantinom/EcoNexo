import { Metadata } from "next";
import { AdminPanel } from "@/components/AdminPanel";

export const metadata: Metadata = {
  title: "Panel de Administración - EcoNexo",
  description: "Gestiona eventos, proyectos y personas usuarias de EcoNexo",
  robots: "noindex, nofollow", // No indexar página de admin
};

export default function AdminPage() {
  return <AdminPanel />;
}
