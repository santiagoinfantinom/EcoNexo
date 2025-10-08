"use client";

type Props = {
  src: string;
  alt: string;
  fallbackSrc: string;
  className?: string;
};

export default function ProjectImage({ src, alt, fallbackSrc, className }: Props) {
  // Use deterministic, relevant fallbacks only. Random pics can mismatch the topic.
  const candidates = [src, fallbackSrc, "/window.svg"];
  let tried = 0;
  return (
    <img
      src={candidates[0]}
      alt={alt}
      loading="lazy"
      className={className}
      referrerPolicy="no-referrer"
      decoding="async"
      crossOrigin="anonymous"
      onError={(e) => {
        const img = e.currentTarget as HTMLImageElement;
        tried += 1;
        if (tried < candidates.length) img.src = candidates[tried];
      }}
    />
  );
}


