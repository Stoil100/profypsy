import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type Props = {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void | (()=>{})|Function;
};

export default function MainButton({
    children,
    className,
    onClick,
}: Props) {
    return (
        <Button
            onClick={onClick}
            className={cn(
                "text-light flex h-fit items-center rounded-full bg-white  text-[#25BA9E] drop-shadow-lg transition-transform duration-300 hover:scale-[1.1] hover:bg-white",
                className,
            )}
        >
            {children}
        </Button>
    );
}
