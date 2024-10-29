"use client";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { AuthT } from "@/models/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Facebook } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "../Providers";
import { useTranslations } from "next-intl";
import { AuthSchema } from "../schemas/auth";

type FormVariant = {
    variant: "register" | "login";
};

const AuthForm = ({ variant = "login" }: FormVariant) => {
    const t = useTranslations("Auth.auth");
    const formSchema = AuthSchema(variant, t);
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
                    "auth/user-not-found": "User does not exist",
                    "auth/claims-too-large": "Claims payload is too large",
                    "auth/id-token-expired": "ID token has expired",
                    "auth/id-token-revoked": "ID token has been revoked",
                    "auth/insufficient-permission":
                        "Insufficient permission for the operation",
                    "auth/internal-error": "Internal error encountered",
                    "auth/invalid-argument": "Invalid argument provided",
                    "auth/invalid-disabled-field":
                        "Invalid disabled user property",
                    "auth/invalid-display-name":
                        "Invalid display name property",
                    "auth/invalid-dynamic-link-domain":
                        "Invalid dynamic link domain for the project",
                    "auth/invalid-email": "Invalid email format",
                    "auth/invalid-email-verified-field":
                        "Invalid emailVerified user property",
                    "auth/invalid-hash-algorithm":
                        "Invalid hash algorithm provided",
                    "auth/invalid-hash-block-size": "Invalid hash block size",
                    "auth/invalid-hash-derived-key-length":
                        "Invalid hash derived key length",
                    "auth/invalid-hash-key": "Invalid hash key",
                    "auth/invalid-hash-memory-cost": "Invalid hash memory cost",
                    "auth/invalid-hash-parallelization":
                        "Invalid hash parallelization",
                    "auth/invalid-hash-rounds": "Invalid hash rounds",
                    "auth/invalid-hash-salt-separator":
                        "Invalid hash salt separator",
                    "auth/invalid-id-token": "Invalid ID token",
                    "auth/invalid-last-sign-in-time":
                        "Invalid last sign in time",
                    "auth/invalid-page-token":
                        "Invalid page token for list operation",
                    "auth/invalid-password": "Invalid password provided",
                    "auth/invalid-password-hash": "Invalid password hash",
                    "auth/invalid-password-salt": "Invalid password salt",
                    "auth/invalid-phone-number": "Invalid phone number",
                    "auth/invalid-photo-url": "Invalid photo URL",
                    "auth/invalid-provider-data": "Invalid provider data",
                    "auth/invalid-provider-id": "Invalid provider ID",
                    "auth/invalid-oauth-responsetype":
                        "Invalid OAuth responseType",
                    "auth/invalid-session-cookie-duration":
                        "Invalid session cookie duration",
                    "auth/invalid-uid": "Invalid user ID",
                    "auth/maximum-user-count-exceeded":
                        "Maximum user count exceeded",
                    "auth/missing-android-pkg-name":
                        "Missing Android package name",
                    "auth/missing-continue-uri": "Missing continue URL",
                    "auth/missing-hash-algorithm": "Missing hash algorithm",
                    "auth/missing-ios-bundle-id": "Missing iOS Bundle ID",
                    "auth/missing-uid": "Missing UID",
                    "auth/operation-not-allowed": "Operation not allowed",
                    "auth/phone-number-already-exists":
                        "Phone number already exists",
                    "auth/project-not-found": "Project not found",
                    "auth/reserved-claims": "Reserved claims present",
                    "auth/session-cookie-revoked":
                        "Session cookie has been revoked",
                    "auth/too-many-requests": "Too many requests",
                    "auth/unauthorized-continue-uri":
                        "Unauthorized continue URI",
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
            <h3 className="z-10 text-center font-playfairDSC text-4xl font-bold capitalize text-[#205041]">
                {variant === "register"
                    ? t("headerRegister")
                    : t("headerLogin")}
            </h3>
            <p className="w-full text-center">{t("usingSocialNetworks")}</p>
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
                <p className="w-full text-center">{t("orWith")}</p>
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
                                        placeholder={t("emailPlaceholder")}
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
                                            placeholder={t(
                                                "passwordPlaceholder",
                                            )}
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
                                                placeholder={t(
                                                    "confirmPasswordPlaceholder",
                                                )}
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
                        {t("submit")}
                    </Button>
                </form>
            </Form>
            <p>
                {variant === "register"
                    ? `${t("alreadyHaveAccount")} `
                    : `${t("doNotHaveAccount")} `}
                <Link
                    href={variant === "register" ? "/login" : "/register"}
                    className="text-[#25ba9e] underline"
                >
                    {variant === "register"
                        ? t("loginHere")
                        : t("registerHere")}
                </Link>
            </p>
        </div>
    );
};

export default AuthForm;
