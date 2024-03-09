"use client";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { AuthT } from "@/models/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "../Providers";
import { Eye, EyeOff, Facebook } from "lucide-react";
import Link from "next/link";

type FormVariant = {
    variant: "register" | "login";
};

const AuthForm = ({ variant }: FormVariant) => {
    const formSchema = z
        .object({
            email: z
                .string()
                .email({ message: "Please enter a valid email address." }),
            phone: z
                .string()
                .regex(
                    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
                    "Invalid phone number",
                )
                .optional(),
            password: z
                .string()
                .regex(/.*[A-Z].*/, "One uppercase character")
                .regex(/.*[a-z].*/, "One lowercase character")
                .regex(/.*\d.*/, "One number")
                .regex(
                    /.*[`~<>?,./!@#$%^&*()\-_+=\"'|{}[\];:\\].*/,
                    "One special character",
                )
                .min(8, "Must be at least 8 characters in length"),
            ...(variant === "register" && {
                confirmPassword: z
                    .string()
                    .min(8, "Must be at least 8 characters in length"),
            }),
        })
        .superRefine(({ confirmPassword, password }, ctx) => {
            if (confirmPassword !== password) {
                ctx.addIssue({
                    code: "custom",
                    message: "The passwords did not match",
                });
            }
        });

    const [visible, setVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { signUp, googleLogin, facebookLogin, microsoftLogin, logIn } =
        useAuth();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            ...(variant === "register" && { confirmPassword: "" }),
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            let errorMessage: any;
            if (variant === "register") {
                errorMessage = await signUp(values as AuthT);
            } else {
                errorMessage = await logIn(values as AuthT);
            }
            if (errorMessage !== null) {
                const errorMessageMap: Record<string, string> = {
                    "auth/email-already-in-use": "Email is already in use",
                };
                setError(
                    errorMessageMap[errorMessage.code] || "An error occurred",
                );
            } else {
                router.push("/");
            }
        } catch (error) {
            console.error("Error:", error);
        }
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3 font-openSans">
            <h3 className="z-10 font-playfairDSC text-4xl font-bold capitalize text-black">
                {variant === "register"
                    ? "Register your account"
                    : "Login to your account"}
            </h3>
            <p className="w-full text-center">Using social networks</p>
            <div className="flex gap-3">
                <Button
                    className="size-[50px] rounded-full bg-[#25ba9e] p-3 transition-all duration-300 hover:scale-110 hover:bg-[#389181]"
                    onClick={googleLogin}
                    disabled={isLoading}
                    type="button"
                >
                    <Icons.google />
                </Button>
                <Button
                    className="size-[50px] rounded-full bg-[#25ba9e] p-0 transition-all duration-300 hover:scale-110 hover:bg-[#389181]"
                    onClick={facebookLogin}
                    disabled={isLoading}
                    type="button"
                >
                    <Facebook />
                </Button>
                <Button
                    className="size-[50px] rounded-full bg-[#25ba9e] p-2 transition-all duration-300 hover:scale-110 hover:bg-[#389181]"
                    onClick={microsoftLogin}
                    disabled={isLoading}
                    type="button"
                >
                    <img src="/auth/microsoft.svg" />
                </Button>
            </div>
            <div className="flex w-full items-center">
                <div className="w-full border-t-2 border-gray-300" />
                <p className="w-full text-center">Or with</p>
                <div className="h-1 w-full border-t-2 border-gray-300" />
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex h-full w-full flex-col justify-between space-y-6 text-black"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your Email here..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex w-full gap-1">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input
                                            type={visible ? "text" : "password"}
                                            placeholder="Enter your password here..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setVisible(!visible)}
                        >
                            {visible ? <Eye /> : <EyeOff />}
                        </Button>
                    </div>
                    {variant === "register" && (
                        <>
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type={
                                                    visible
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Confirm your password here..."
                                                {...field}
                                                value={field.value as string}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {error && <p>{error}</p>}
                        </>
                    )}
                    <Button
                        className="w-full bg-[#25ba9e] hover:bg-[#389181]"
                        type="submit"
                        disabled={isLoading}
                    >
                        Submit
                    </Button>
                </form>
            </Form>
            <p>
                {variant === "register"
                    ? "Already have an account?"
                    : "Don't have an account?"}{" "}
                <Link
                    href={variant === "register" ? "/login" : "/register"}
                    className="text-[#25ba9e] underline"
                >
                    {variant === "register" ? "Login here" : "Register here"}
                </Link>
            </p>
        </div>
    );
};
AuthForm.defaultProps = {
    variant: "login"
};

export default AuthForm;
