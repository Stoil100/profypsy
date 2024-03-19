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
import Link from "next/link";

export default function Navigation() {
    return (
        <header className="fixed top-0 flex w-full items-center justify-between p-3 text-white z-[100]">
            <div className="flex items-center gap-4 flex-1">
                <Button
                    variant="outline"
                    className="font-openSans h-fit rounded-full bg-transparent px-4"
                >
                    Log in
                </Button>
                <h3 className="font-openSans font-thin">For you</h3>
            </div>
            <h1 className="font-playfairDSC text-4xl font-thin uppercase drop-shadow-md flex-1 text-center">
                Profypsy
            </h1>
            <div className="flex items-center gap-4 flex-1 justify-end">
                <Link href={"/appliance"} className="font-nunito font-thin">
                    Join as a psychologist
                </Link>
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
