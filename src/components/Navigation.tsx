import React from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

export default function Navigation() {
    return (
        <header className="fixed top-0 flex w-full items-center justify-between p-3 text-white">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    className="font-openSans h-fit rounded-full bg-transparent px-4"
                >
                    Log in
                </Button>
                <h3 className="font-openSans font-thin">For you</h3>
            </div>
            <h1 className="font-playfairDSC text-4xl font-thin capitalize">
                Profypsy
            </h1>
            <div className="flex items-center gap-4">
                <h4 className="font-nunito font-thin">
                    Join as a psychologist
                </h4>
                <Sheet>
                    <SheetTrigger className="">
                        <Menu />
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader>
                            <SheetTitle>Are you absolutely sure?</SheetTitle>
                            <SheetDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
