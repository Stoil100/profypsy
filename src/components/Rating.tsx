"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface StarRatingProps {
    initialRating?: number;
    variant?: "box" | "input";
    onChange?: (rating: number) => void;
    className?: string;
}

export default function StarRating({
    initialRating = 0,
    variant = "box",
    onChange,
    className,
}: StarRatingProps) {
    const [rating, setRating] = useState(initialRating || undefined);
    const [hover, setHover] = useState(0);

    const handleClick = (value: number) => {
        setRating(value);
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center",
                className,
            )}
        >
            <p className="mb-2 text-6xl" aria-live="polite">
                {rating}.0
            </p>
            {/* {variant === "input" && <h3>Please leave a review</h3>} */}
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        disabled={variant === "box"}
                        className={`p-1 ${hover >= star || rating! >= star ? "text-yellow-400" : "text-gray-300"}`}
                        onClick={() => handleClick(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        aria-label={`Rate ${star} stars out of 5`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-8 w-8"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                ))}
            </div>
        </div>
    );
}
