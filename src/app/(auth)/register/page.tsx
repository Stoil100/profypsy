import RegisterForm from "@/components/forms/auth";

export default function Register() {
    return (
        <main className="flex h-screen max-h-screen items-center justify-around overflow-y-hidden bg-[#FCFBF4]">
            <div className="relative flex h-full w-1/2 flex-col items-center justify-center gap-8 ">
                <img
                    src="/auth/session.png"
                    className=" z-10 mr-10 h-auto max-h-[550px] drop-shadow-lg"
                />
                <img
                    className="absolute left-0 w-full rotate-180"
                    src="/auth/pattern.png"
                />
            </div>
            <div className="relative flex h-full w-1/2 flex-col items-center justify-center space-y-5 drop-shadow-lg">
                <div className="z-10 w-2/3">
                    <RegisterForm variant="register"/>
                </div>
            </div>
            
        </main>
    );
}