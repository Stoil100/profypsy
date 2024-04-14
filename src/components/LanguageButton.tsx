"use client";

import { Languages } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

type LanguageT = "БГ" | "EN";

export default function LanguageButton() {
    const [language, setLanguage] = useState<LanguageT>("БГ");
    return (
        <Button
            onClick={() => setLanguage(language === "БГ" ? "EN" : "БГ")}
            variant="outline"
            className="flex h-fit w-16 items-center justify-between bg-transparent p-1 text-white"
        >
            <Languages />
            <p>{language}</p>
        </Button>
    );
}
