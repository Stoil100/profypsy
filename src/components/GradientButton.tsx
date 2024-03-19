import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type Props = {
    children: React.ReactNode;
    className?: string;
    buttonClassName?: string;
    onClick?: () => void | (()=>{})|Function;
};

export default function GradientButton({
    children,
    className,
    buttonClassName,
    onClick,
}: Props) {
    return (
        <Button
            onClick={onClick}
            className={cn(
                "h-fit rounded-full bg-white transition-transform duration-300 hover:scale-[1.1] hover:bg-white drop-shadow-lg",
                buttonClassName,
            )}
        >
            <p
                className={cn(
                    "text-light text-[#25BA9E]",
                    className,
                )}
            >
                {children}
            </p>
        </Button>
    );
}
