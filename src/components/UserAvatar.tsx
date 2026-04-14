"use client";

import React from "react";

type UserAvatarProps = {
  src?: string | null;
  alt: string;
  name?: string;
  sizeClassName?: string;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  fallbackText?: string;
};

export default function UserAvatar({
  src,
  alt,
  name,
  sizeClassName = "w-10 h-10",
  className = "",
  imageClassName = "object-cover",
  fallbackClassName = "",
  fallbackText,
}: UserAvatarProps) {
  const [hasError, setHasError] = React.useState(false);
  React.useEffect(() => {
    setHasError(false);
  }, [src]);

  const safeName = (name || alt || "").trim();
  const computedFallback = fallbackText || safeName.slice(0, 1).toUpperCase() || "?";
  const showImage = !!src && !hasError;

  return (
    <div
      className={`${sizeClassName} rounded-full overflow-hidden flex items-center justify-center ${className}`}
      aria-label={alt}
      title={alt}
    >
      {showImage ? (
        <img
          src={src as string}
          alt={alt}
          className={`${sizeClassName} ${imageClassName}`}
          onError={() => setHasError(true)}
          loading="lazy"
        />
      ) : (
        <span className={`text-xs font-bold ${fallbackClassName}`}>{computedFallback}</span>
      )}
    </div>
  );
}
