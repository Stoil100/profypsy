import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "./ui/button";

type Props = {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void | (() => {}) | Function;
    type?: "submit" | "reset" | "button";
};



export default function MainButton({ children, className, type = "button", onClick }: Props){
    return (
        <Button
            type={type}
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
