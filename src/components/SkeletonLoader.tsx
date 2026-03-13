"use client";
import React from "react";

interface SkeletonLoaderProps {
  variant?: "text" | "circular" | "rectangular" | "card" | "list";
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
  animated?: boolean;
}

export default function SkeletonLoader({
  variant = "rectangular",
  width,
  height,
  className = "",
  count = 1,
  animated = true,
}: SkeletonLoaderProps) {
  const baseClasses = `bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 ${
    animated ? "animate-shimmer" : ""
  }`;

  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
    card: "rounded-xl",
    list: "rounded-md",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  const skeletonElement = (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );

  if (count === 1) {
    return skeletonElement;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>{skeletonElement}</React.Fragment>
      ))}
    </div>
  );
}

// Card Skeleton Component
export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700"
        >
          {/* Image skeleton */}
          <SkeletonLoader variant="rectangular" height={200} className="w-full" />
          
          {/* Content skeleton */}
          <div className="p-6 space-y-4">
            {/* Badge */}
            <SkeletonLoader variant="rectangular" width={100} height={24} className="rounded-full" />
            
            {/* Title */}
            <SkeletonLoader variant="text" width="80%" height={24} />
            <SkeletonLoader variant="text" width="60%" height={24} />
            
            {/* Date and location */}
            <div className="flex gap-4">
              <SkeletonLoader variant="text" width={120} height={20} />
              <SkeletonLoader variant="text" width={100} height={20} />
            </div>
            
            {/* Description */}
            <SkeletonLoader variant="text" width="100%" height={16} />
            <SkeletonLoader variant="text" width="90%" height={16} />
            <SkeletonLoader variant="text" width="75%" height={16} />
            
            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-slate-700">
              <SkeletonLoader variant="text" width={80} height={20} />
              <SkeletonLoader variant="text" width={100} height={20} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

// List Item Skeleton
export function ListItemSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700"
        >
          <SkeletonLoader variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-2">
            <SkeletonLoader variant="text" width="60%" height={20} />
            <SkeletonLoader variant="text" width="40%" height={16} />
          </div>
          <SkeletonLoader variant="rectangular" width={80} height={32} className="rounded-lg" />
        </div>
      ))}
    </div>
  );
}

