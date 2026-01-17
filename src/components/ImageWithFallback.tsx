"use client";
import React, { useState, useEffect } from "react";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
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
    const [imgSrc, setImgSrc] = useState(src);
    const [retryStage, setRetryStage] = useState(0); // 0: initial, 1: category fallback, 2: default fallback

    useEffect(() => {
        setImgSrc(src);
        setRetryStage(0);
    }, [src]);

    const handleError = () => {
        // Stage 1: Try category fallback if available
        if (retryStage === 0 && category) {
            const normalizedCategory = category.toLowerCase().trim();
            let categoryImage = "";

            if (normalizedCategory.includes('medio ambiente') || normalizedCategory.includes('environment') || normalizedCategory.includes('umwelt')) {
                categoryImage = "/assets/categories/environment.jpg";
            } else if (normalizedCategory.includes('educación') || normalizedCategory.includes('education') || normalizedCategory.includes('bildung')) {
                categoryImage = "/assets/categories/education.jpg";
            } else if (normalizedCategory.includes('salud') || normalizedCategory.includes('health') || normalizedCategory.includes('gesundheit')) {
                categoryImage = "/assets/categories/health.jpg";
            } else if (normalizedCategory.includes('océanos') || normalizedCategory.includes('oceans') || normalizedCategory.includes('ozeane')) {
                categoryImage = "/assets/categories/oceans.jpg";
            } else if (normalizedCategory.includes('alimentación') || normalizedCategory.includes('food') || normalizedCategory.includes('ernährung')) {
                categoryImage = "/assets/categories/food.jpg";
            } else if (normalizedCategory.includes('comunidad') || normalizedCategory.includes('community') || normalizedCategory.includes('gemeinschaft')) {
                categoryImage = "/assets/categories/community.jpg";
            } else if (normalizedCategory.includes('tecnología') || normalizedCategory.includes('technology') || normalizedCategory.includes('technologie')) {
                categoryImage = "/assets/categories/technology.jpg";
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
        <img
            src={imgSrc}
            alt={alt}
            onError={handleError}
            className={className}
            referrerPolicy={referrerPolicy}
            {...props}
        />
    );
}
