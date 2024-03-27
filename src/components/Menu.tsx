"use client"
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { CalendarCheck, ChevronRight, LogOutIcon, Newspaper, Palette, User,MenuIcon, LogInIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GradientButton from "./GradientButton";
import { useAuth } from "./Providers";
import { Button } from "./ui/button";
import { UserType } from "@/models/user";
import { Guidance } from "./Guidance";
interface MenuItemProps {
    href: string;
    icon: React.ElementType;
    title: string;
  }
  interface SheetBodyProps {
    user: UserType;
    logOut: () => void;
  }

const MenuItem: React.FC<MenuItemProps> = ({ href, icon: IconComponent, title }) => (
    <Link
      href={href}
      className="flex w-full items-center justify-between gap-2 transition-all hover:scale-110 pt-3"
    >
      <div className="flex size-10 items-center justify-center rounded-full border-2">
        <IconComponent />
      </div>
      <p className="text-xl">{title}</p>
      <ChevronRight />
    </Link>
  );

  const SheetBody: React.FC = () => {
    const router = useRouter();
    const {user,logOut}=useAuth();
    return (
        
        // <div className="w-full space-y-3 divide-y-[3px] rounded-2xl bg-[#40916C] p-4 px-10 text-center text-white">
        //     <MenuItem href="/profile" icon={User} title="Profile" />
        //     <MenuItem
        //         href="/search"
        //         icon={CalendarCheck}
        //         title="Book a session"
        //     />
        //     <MenuItem href="/articles" icon={Palette} title="Articles" />
        //     <Button
        //         onClick={() => {
        //             logOut();
        //         }}
        //         variant="ghost"
        //         className="flex w-full items-center justify-between rounded-none px-0 pt-7 pb-4 transition-all hover:scale-110 hover:bg-transparent hover:text-white"
        //     >
        //         <div className="flex size-10 items-center justify-center rounded-full border-2">
        //             <LogOutIcon />
        //         </div>
        //         <p className="text-xl">Logout</p>
        //         <ChevronRight />
        //     </Button>
        //     <div className="space-y-2 pt-3">
        //         {user.role !== "psychologist" && (
        //             <>
        //                 <div>
        //                     <GradientButton
        //                         onClick={() => {
        //                             router.push("/appliance");
        //                         }}
        //                         className="w-full justify-between gap-2 rounded-sm"
        //                     >
        //                         Join our psychologists team
        //                     </GradientButton>
        //                 </div>
        //             </>
        //         )}
        //         <GradientButton className="w-full justify-between gap-2 rounded-sm">
        //             Subscribe to our newsletter
        //         </GradientButton>
        //     </div>
        // </div>
        <Guidance variant="navigation"/>
    );
  };

export default function Menu(){

    
    
    return (
        <div className="flex flex-1 items-center justify-end gap-4 text-inherit">
            <Sheet>
                <SheetTrigger className="text-inherit">
                    <MenuIcon />
                </SheetTrigger>
                <SheetContent
                    side="top"
                    className="z-[110] flex w-full flex-col items-center justify-between bg-gradient-to-b from-[#40916C] to-[#52B788] text-white sm:w-auto"
                >
                    <SheetHeader>
                        <SheetTitle className="text-center font-playfairDSC text-4xl text-white underline decoration-2">
                            Menu
                        </SheetTitle>
                    </SheetHeader>
                    <SheetBody />
                    <SheetFooter>
                        <p className="text-sm italic text-white">
                            Profypsy &copy; {new Date().getFullYear()}
                        </p>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );}