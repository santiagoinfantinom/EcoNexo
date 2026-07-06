"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

import { ImageProps } from "next/image";

interface ImageWithFallbackProps extends Omit<ImageProps, "src" | "alt"> {
    src?: string;
    alt?: string;
    fallbackSrc?: string;
    category?: string;
}

export default function ImageWithFallback({
    src,
    alt,
    fallbackSrc = "/assets/default-event.png",
    category,
    className,
    referrerPolicy = "no-referrer",
    fill,
    priority,
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    ...props
}: ImageWithFallbackProps) {
    const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
    const [retryStage, setRetryStage] = useState(0);

    const getCategoryImage = (value?: string, prefix = "") => {
        if (!value) return "";
        const normalizedCategory = value.toLowerCase().trim();
        if (normalizedCategory.includes('medio ambiente') || normalizedCategory.includes('environment') || normalizedCategory.includes('umwelt')) {
            return `${prefix}/assets/categories/environment.jpg`;
        }
        if (normalizedCategory.includes('educación') || normalizedCategory.includes('education') || normalizedCategory.includes('bildung')) {
            return `${prefix}/assets/categories/education.jpg`;
        }
        if (normalizedCategory.includes('salud') || normalizedCategory.includes('health') || normalizedCategory.includes('gesundheit')) {
            return `${prefix}/assets/categories/health.jpg`;
        }
        if (normalizedCategory.includes('océanos') || normalizedCategory.includes('oceans') || normalizedCategory.includes('ozeane')) {
            return `${prefix}/assets/categories/oceans.jpg`;
        }
        if (normalizedCategory.includes('alimentación') || normalizedCategory.includes('food') || normalizedCategory.includes('ernährung')) {
            return `${prefix}/assets/categories/food.jpg`;
        }
        if (normalizedCategory.includes('comunidad') || normalizedCategory.includes('community') || normalizedCategory.includes('gemeinschaft')) {
            return `${prefix}/assets/categories/community.jpg`;
        }
        if (normalizedCategory.includes('tecnología') || normalizedCategory.includes('technology') || normalizedCategory.includes('technologie')) {
            return `${prefix}/assets/categories/technology.jpg`;
        }
        return "";
    };

    useEffect(() => {
        const isGH = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
        const prefix = isGH ? '/EcoNexo' : '';

        // If it's a local path starting with / and doesn't already have the prefix
        let finalSrc = src;
        if (src && src.startsWith('/') && !src.startsWith('http') && !src.startsWith(prefix + '/')) {
            // Special treatment for assets that should be in the root of public
            finalSrc = `${prefix}${src}`;
        }

        // Force-replace legacy generic project thumbnails with thematic category images.
        if (finalSrc && finalSrc.startsWith(`${prefix}/projects/`) || finalSrc?.startsWith('/projects/')) {
            const categoryImage = getCategoryImage(category, prefix);
            if (categoryImage) {
                finalSrc = categoryImage;
            }
        }

        setImgSrc(finalSrc || fallbackSrc);
        setRetryStage(0);
    }, [src, fallbackSrc, category]);

    const handleError = () => {
        // Stage 1: Try category fallback if available
        if (retryStage === 0 && category) {
            const isGH = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
            const prefix = isGH ? '/EcoNexo' : '';
            const categoryImage = getCategoryImage(category, prefix);

            if (categoryImage) {
                setImgSrc(categoryImage);
                setRetryStage(1);
                return;
            }
        }

        // Stage 2: Fallback to default generic image
        if (retryStage < 2) {
            setImgSrc(fallbackSrc);
            setRetryStage(2);
        }
    };

    return (
        <Image
            src={imgSrc || fallbackSrc}
            alt={alt || "Image"}
            onError={handleError}
            className={className}
            referrerPolicy={referrerPolicy as any}
            fill={!props.width && !props.height}
            sizes={fill ? sizes : undefined}
            priority={priority}
            {...(props as any)}
        />
    );
}
