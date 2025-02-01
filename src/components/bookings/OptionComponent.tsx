import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import type React from "react";

interface OptionProps {
    name: string;
    iconSrc: string;
    isSelected: boolean;
    onSelect: () => void;
}

export const OptionComponent: React.FC<OptionProps> = ({
    name,
    iconSrc,
    isSelected,
    onSelect,
}) => (
    <div
        onClick={onSelect}
        className={cn(
            "flex cursor-pointer items-center space-x-2 rounded-lg bg-[#FCFBF4] p-1 drop-shadow-lg transition-all hover:md:scale-110",
            isSelected &&
                "bg-gradient-to-r from-[#23A53D] to-[#6DD864] text-white",
        )}
    >
        <img
            src={iconSrc || "/placeholder.svg"}
            className="size-16 md:size-20"
            alt={name}
        />
        <p className="text-md md:text-xl">{name}</p>
        <ChevronRight />
    </div>
);
