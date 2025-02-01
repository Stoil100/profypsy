import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface LanguageSelectorProps {
    language: string;
    imageSrc: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
    language,
    imageSrc,
}) => {
    const [isChecked, setIsChecked] = useState(false);

    const toggleCheckbox = () => setIsChecked(!isChecked);

    return (
        <div
            className={cn(
                "flex w-full cursor-pointer items-center gap-2 rounded-lg bg-[#FCFBF4] p-2 drop-shadow-lg transition-all hover:md:scale-110",
                isChecked &&
                    "bg-gradient-to-r from-[#23A53D] to-[#6DD864] text-white",
            )}
            onClick={toggleCheckbox}
        >
            <Checkbox id={language} checked={isChecked} />
            <div className="flex items-center justify-center gap-2">
                <img src={imageSrc || "/placeholder.svg"} alt={language} />
                <p className="text-xl">{language}</p>
            </div>
        </div>
    );
};
