"use client";

type Props = {
  src: string;
  alt: string;
  fallbackSrc: string;
  className?: string;
};

export default function ProjectImage({ src, alt, fallbackSrc, className }: Props) {
  const candidates = [
    src,
    // Picsum fallback if Unsplash blocks
    "https://picsum.photos/1200/600",
    fallbackSrc,
  ];
  let tried = 0;
  return (
    <img
      src={candidates[0]}
      alt={alt}
      loading="lazy"
      className={className}
      referrerPolicy="no-referrer"
      onError={(e) => {
        const img = e.currentTarget as HTMLImageElement;
        tried += 1;
        if (tried < candidates.length) img.src = candidates[tried];
      }}
    />
  );
}


