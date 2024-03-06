import { Facebook, Instagram, Languages, Twitter } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import GradientButton from "./GradientButton";

export default function Footer() {
    return (
        <footer className="flex min-h-[33vh] flex-wrap items-start justify-center gap-14 bg-[#525174] py-10 text-xl font-thin text-white">
            <div className="font-openSans flex flex-col gap-2 text-white">
                <div className="flex w-full items-center justify-between text-[#F1ECCC]">
                    <Instagram size={48} absoluteStrokeWidth />
                    <Facebook size={48} absoluteStrokeWidth />
                    <Twitter size={48} absoluteStrokeWidth />
                </div>
                <h3 className="font-playfairDSC text-3xl uppercase">
                    Profypsy
                </h3>
                <p>Str. Macedonia #58G</p>
                <p>Sofia, 1000</p>
            </div>
            <div className="flex flex-col gap-1">
                <h4 className="text-2xl">Services</h4>
                <p>For You</p>
                <p>Couples</p>
                <p>Families</p>
            </div>
            <div className="flex flex-col gap-1">
                <h4 className="text-2xl">Useful Links</h4>
                <p>Find a therapist</p>
                <p>Mental Health Library</p>
                <p>Blog</p>
            </div>
            <div className="flex flex-col gap-1">
                <h4 className="text-2xl">About</h4>
                <p>Privacy policy</p>
                <p>Terms of use </p>
                <GradientButton buttonClassName="rounded-md">
                    Subscribe to newsletter
                </GradientButton>
                <GradientButton buttonClassName="rounded-md">
                    Join as a psychologist
                </GradientButton>
                <Button
                    variant="outline"
                    className="flex h-fit w-fit items-center justify-between gap-2 bg-transparent px-2 py-1 font-thin"
                >
                    <p>English</p>
                    <Languages size={20} />
                </Button>
            </div>
        </footer>
    );
}
