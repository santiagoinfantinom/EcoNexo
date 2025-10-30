import { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";
import AboutClient from "./AboutClient";

export const metadata: Metadata = generateMetadata("en");

export default function AboutPage() {
  return <AboutClient />;
}
