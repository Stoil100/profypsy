"use client";
import { auth, db } from "@/firebase/config";
import { AuthT } from "@/models/auth";
import { UserType } from "@/models/user";
import {
    AuthError,
    FacebookAuthProvider,
    GoogleAuthProvider,
    OAuthProvider,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

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
        userName: null,
        image: null,
        phone: null,
        admin: null,
    });
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        let unsubscribeDoc = () => {}; // Initialize to a no-op function

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                setLoading(true);

                // Immediately fetch user document to ensure we have initial data
                getDoc(userRef)
                    .then((docSnap) => {
                        if (docSnap.exists()) {
                            setUser({
                                email: user.email,
                                uid: user.uid,
                                userName: user.displayName,
                                image: user.photoURL,
                                phone: user.phoneNumber,
                                role: docSnap.data().role,
                                appointments: docSnap.data().appointments,
                                admin: docSnap.data().admin,
                            });
                            setLoading(false);
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
                                appointments: doc.data().appointments,
                                admin: doc.data().admin,
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
                    userName: null,
                    image: null,
                    phone: null,
                    admin: null,
                });
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            unsubscribeDoc();
        };
    }, []);

    const createUserDocument = async (user: UserType) => {
        await setDoc(doc(db, "users", user.uid!), {
            email: user.email,
            uid: user.uid,
            role: user.role,
            appointments: user.appointments,
            image: user.image,
            userName: user.userName,
            phone: user.phone,
            admin: user.admin,
        });
    };

    const handleUserAfterAuth = async (user: UserType) => {
        await createUserDocument(user);
        router.push(`/profile`);
    };

    const signUp = async (values: AuthT): Promise<boolean | AuthError> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password,
            );
            if (userCredential.user) {
                await sendEmailVerification(userCredential.user);
                alert(
                    "Please verify your email before continuing to your profile.",
                );
            }
            await handleUserAfterAuth({
                email: userCredential.user.email,
                uid: userCredential.user.uid,
                userName: userCredential.user.displayName,
                image: userCredential.user.photoURL,
                phone: userCredential.user.phoneNumber,
                role: "user",
                appointments: [],
                admin: false,
            });
            return true;
        } catch (error) {
            return error as AuthError;
        }
    };

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
                userName: userCredential.user.displayName,
                image: userCredential.user.photoURL,
                phone: userCredential.user.phoneNumber,
                role: docSnap.data()!.role,
                appointments: docSnap.data()!.appointments,
                admin: docSnap.data()!.admin,
            });
            router.push(`/profile`);
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
                    userName: result.user.displayName,
                    image: result.user.photoURL,
                    phone: result.user.phoneNumber,
                    role: "user",
                    appointments: [],
                    admin: false,
                });
            } else {
                const userRef = doc(db, "users", result.user.uid);
                const docSnap = await getDoc(userRef);
                setUser({
                    email: result.user.email,
                    uid: result.user.uid,
                    userName: result.user.displayName,
                    image: result.user.photoURL,
                    phone: result.user.phoneNumber,
                    role: docSnap.data()!.role,
                    appointments: docSnap.data()!.appointments,
                    admin: docSnap.data()!.admin,
                });
                router.push(`/profilе`);
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
                    userName: result.user.displayName,
                    image: result.user.photoURL,
                    phone: result.user.phoneNumber,
                    role: "user",
                    appointments: [],
                    admin: false,
                });
            } else {
                const userRef = doc(db, "users", result.user.uid);
                const docSnap = await getDoc(userRef);
                setUser({
                    email: result.user.email,
                    uid: result.user.uid,
                    userName: result.user.displayName,
                    image: result.user.photoURL,
                    phone: result.user.phoneNumber,
                    role: docSnap.data()!.role,
                    appointments: docSnap.data()!.appointments,
                    admin: docSnap.data()!.admin,
                });
                router.push(`/profile`);
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
                    userName: result.user.displayName,
                    image: result.user.photoURL,
                    phone: result.user.phoneNumber,
                    role: "user",
                    appointments: [],
                    admin: false,
                });
            } else {
                const userRef = doc(db, "users", result.user.uid);
                const docSnap = await getDoc(userRef);
                setUser({
                    email: result.user.email,
                    uid: result.user.uid,
                    userName: result.user.displayName,
                    image: result.user.photoURL,
                    phone: result.user.phoneNumber,
                    role: docSnap.data()!.role,
                    appointments: docSnap.data()!.appointments,
                    admin: docSnap.data()!.admin,
                });
                router.push(`/profile`);
            }
        } catch (error) {
            return error as AuthError;
        }
    };

    const logOut = async (): Promise<void> => {
        try {
            await signOut(auth);
            setUser({
                email: null,
                uid: null,
                role: null,
                appointments: null,
                userName: null,
                image: null,
                phone: null,
                admin: null,
            });
            router.push("/");
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

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
