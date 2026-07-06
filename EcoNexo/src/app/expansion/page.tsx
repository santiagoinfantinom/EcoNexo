import { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";
import GeographicExpansion from "@/components/GeographicExpansion";

export const metadata: Metadata = generateMetadata("es");

export default function GeographicExpansionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <GeographicExpansion />
    </div>
  );
}
