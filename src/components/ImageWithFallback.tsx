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
    ...props
}: ImageWithFallbackProps) {
    const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
    const [retryStage, setRetryStage] = useState(0);

    useEffect(() => {
        const isGH = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
        const prefix = isGH ? '/EcoNexo' : '';

        // If it's a local path starting with / and doesn't already have the prefix
        let finalSrc = src;
        if (src && src.startsWith('/') && !src.startsWith('http') && !src.startsWith(prefix + '/')) {
            // Special treatment for assets that should be in the root of public
            finalSrc = `${prefix}${src}`;
        }

        setImgSrc(finalSrc || fallbackSrc);
        setRetryStage(0);
    }, [src, fallbackSrc]);

    const handleError = () => {
        // Stage 1: Try category fallback if available
        if (retryStage === 0 && category) {
            const normalizedCategory = category.toLowerCase().trim();
            const isGH = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
            const prefix = isGH ? '/EcoNexo' : '';
            let categoryImage = "";

            if (normalizedCategory.includes('medio ambiente') || normalizedCategory.includes('environment') || normalizedCategory.includes('umwelt')) {
                categoryImage = `${prefix}/assets/categories/environment.jpg`;
            } else if (normalizedCategory.includes('educación') || normalizedCategory.includes('education') || normalizedCategory.includes('bildung')) {
                categoryImage = `${prefix}/assets/categories/education.jpg`;
            } else if (normalizedCategory.includes('salud') || normalizedCategory.includes('health') || normalizedCategory.includes('gesundheit')) {
                categoryImage = `${prefix}/assets/categories/health.jpg`;
            } else if (normalizedCategory.includes('océanos') || normalizedCategory.includes('oceans') || normalizedCategory.includes('ozeane')) {
                categoryImage = `${prefix}/assets/categories/oceans.jpg`;
            } else if (normalizedCategory.includes('alimentación') || normalizedCategory.includes('food') || normalizedCategory.includes('ernährung')) {
                categoryImage = `${prefix}/assets/categories/food.jpg`;
            } else if (normalizedCategory.includes('comunidad') || normalizedCategory.includes('community') || normalizedCategory.includes('gemeinschaft')) {
                categoryImage = `${prefix}/assets/categories/community.jpg`;
            } else if (normalizedCategory.includes('tecnología') || normalizedCategory.includes('technology') || normalizedCategory.includes('technologie')) {
                categoryImage = `${prefix}/assets/categories/technology.jpg`;
            }

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
            {...(props as any)}
        />
    );
}
