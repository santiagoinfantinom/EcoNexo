"use client";
import Link from "next/link";

type BackButtonProps = {
  href?: string;
  label: string;
  className?: string;
};

export default function BackButton({ href = "/", label, className }: BackButtonProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border-2 border-emerald-600 text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white transition-colors text-sm sm:text-base font-medium shadow-sm hover:shadow-md ${className ?? ""}`}
    >
      <span className="text-lg">←</span> <span>{label}</span>
    </Link>
  );
}


