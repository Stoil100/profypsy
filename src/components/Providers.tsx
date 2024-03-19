"use client";
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { auth, db } from "@/firebase/config";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    GoogleAuthProvider,
    OAuthProvider,
    FacebookAuthProvider,
    AuthError,
} from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { AuthT } from "@/models/auth";
import { useRouter } from "next/navigation";
import { AppointmentT } from "@/app/(logic)/search/[id]/page";

interface UserType {
    email: string | null;
    uid: string | null;
    role: string | null;
    appointments: AppointmentT[] | null;
}

interface AuthContextType {
    user: UserType;
    loading: boolean;
    signUp: (values: AuthT) => Promise<boolean | AuthError>;
    logIn: (values: AuthT) => Promise<void | AuthError>;
    googleLogin: () => Promise<void | AuthError>;
    microsoftLogin: () => Promise<void | AuthError>;
    facebookLogin: () => Promise<void | AuthError>;
    logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within a AuthContextProvider");
    }
    return context;
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType>({
        email: null,
        uid: null,
        role: null,
        appointments: null,
    });
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        let unsubscribeDoc = () => {}; // Initialize to a no-op function

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                setLoading(true); // Ensure loading state is true when starting to fetch user data

                // Immediately fetch user document to ensure we have initial data
                getDoc(userRef)
                    .then((docSnap) => {
                        if (docSnap.exists()) {
                            setUser({
                                email: user.email,
                                uid: user.uid,
                                role: docSnap.data().role,
                                appointments: docSnap.data().appointments,
                            });
                            setLoading(false); // Set loading to false after initial data is fetched
                        } else {
                            console.log("No such document!");
                            setLoading(false);
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching user document:", error);
                        setLoading(false);
                    });

                // Setup real-time document listener
                unsubscribeDoc = onSnapshot(
                    userRef,
                    (doc) => {
                        if (doc.exists()) {
                            setUser((prevUser) => ({
                                ...prevUser,
                                role: doc.data().role,
                                appointments:doc.data().appointments
                            }));
                        }
                    },
                    (error) => {
                        console.error(
                            "Error listening to user document:",
                            error,
                        );
                    },
                );
            } else {
                setUser({
                    email: null,
                    uid: null,
                    role: null,
                    appointments: null,
                });
                setLoading(false);
            }
        });

        // Cleanup function
        return () => {
            unsubscribeAuth();
            unsubscribeDoc(); // Unsubscribe from document listener when the component unmounts
        };
    }, []);

    const createUserDocument = async (user: UserType) => {
        await setDoc(doc(db, "users", user.uid!), {
            email: user.email,
            uid: user.uid,
            role: user.role,
            appointments: user.appointments,
        });
    };

    const handleUserAfterAuth = async (user: UserType) => {
        await createUserDocument(user);
        router.push(`/profile/${user.uid}`);
    };

    const signUp = async (values: AuthT): Promise<boolean | AuthError> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password,
            );
            await handleUserAfterAuth({
                email: userCredential.user.email,
                uid: userCredential.user.uid,
                role: "user",
                appointments: [],
            });
            return true;
        } catch (error) {
            return error as AuthError;
        }
    };

    // Continued from previous implementation...

    const logIn = async (values: AuthT): Promise<void | AuthError> => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                values.email,
                values.password,
            );
            const userRef = doc(db, "users", userCredential.user.uid);
            const docSnap = await getDoc(userRef);
            setUser({
                email: userCredential.user.email,
                uid: userCredential.user.uid,
                role: docSnap.data()!.role,
                appointments: docSnap.data()!.appointments,
            });
            router.push(`/profile/${userCredential.user.uid}`);
        } catch (error) {
            return error as AuthError;
        }
    };

    const googleLogin = async (): Promise<void | AuthError> => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const isNewUser =
                result.user.metadata.creationTime ===
                result.user.metadata.lastSignInTime;
            if (isNewUser) {
                await handleUserAfterAuth({
                    email: result.user.email,
                    uid: result.user.uid,
                    role: "user",
                    appointments: [],
                });
            } else {
                const userRef = doc(db, "users", result.user.uid);
                const docSnap = await getDoc(userRef);
                setUser({
                    email: result.user.email,
                    uid: result.user.uid,
                    role: docSnap.data()!.role,
                    appointments: docSnap.data()!.appointments,
                });
                router.push(`/profile/${result.user.uid}`);
            }
        } catch (error) {
            return error as AuthError;
        }
    };

    const microsoftLogin = async (): Promise<void | AuthError> => {
        const provider = new OAuthProvider("microsoft.com");
        try {
            const result = await signInWithPopup(auth, provider);
            const isNewUser =
                result.user.metadata.creationTime ===
                result.user.metadata.lastSignInTime;
            if (isNewUser) {
                await handleUserAfterAuth({
                    email: result.user.email,
                    uid: result.user.uid,
                    role: "user",
                    appointments: [],
                });
            } else {
                const userRef = doc(db, "users", result.user.uid);
                const docSnap = await getDoc(userRef);
                setUser({
                    email: result.user.email,
                    uid: result.user.uid,
                    role: docSnap.data()!.role,
                    appointments: docSnap.data()!.appointments,
                });
                router.push(`/profile/${result.user.uid}`);
            }
        } catch (error) {
            return error as AuthError;
        }
    };

    const facebookLogin = async (): Promise<void | AuthError> => {
        const provider = new FacebookAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const isNewUser =
                result.user.metadata.creationTime ===
                result.user.metadata.lastSignInTime;
            if (isNewUser) {
                await handleUserAfterAuth({
                    email: result.user.email,
                    uid: result.user.uid,
                    role: "user",
                    appointments: [],
                });
            } else {
                const userRef = doc(db, "users", result.user.uid);
                const docSnap = await getDoc(userRef);
                setUser({
                    email: result.user.email,
                    uid: result.user.uid,
                    role: docSnap.data()!.role,
                    appointments: docSnap.data()!.appointments,
                });
                router.push(`/profile/${result.user.uid}`);
            }
        } catch (error) {
            return error as AuthError;
        }
    };

    const logOut = async (): Promise<void> => {
        try {
            await signOut(auth);
            setUser({ email: null, uid: null, role: null, appointments: null });
            router.push("/");
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    // Rest of the AuthContextProvider component remains the same...

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signUp,
                logIn,
                googleLogin,
                microsoftLogin,
                facebookLogin,
                logOut,
            }}
        >
            {loading ? null : children}
        </AuthContext.Provider>
    );
};
