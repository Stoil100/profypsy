"use client";
import { auth, db } from "@/firebase/config";
import { AuthT } from "@/models/auth";
import {
    GoogleAuthProvider,
    OAuthProvider,
    FacebookAuthProvider,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
interface UserType {
    email: string | null;
    uid: string | null;
}

const AuthContext = createContext({});
export const useAuth = () => useContext<any>(AuthContext);

export const AuthContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [user, setUser] = useState<UserType>({
        email: null,
        uid: null,
    });
    const [loading, setLoading] = useState<Boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(db, "users", user?.uid);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {                  
                    setUser({
                        email: user.email,
                        uid: user.uid,
                    });
                }
            } else {
                setUser({ email: null, uid: null});
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signUp = async (values: AuthT) => {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
          const user = userCredential.user;
          await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            uid: user.uid,
          });
      
          return true;
        } catch (error) {
          return error;
        }
      };

    // Login the user
    const logIn = (values:AuthT) => {
        return signInWithEmailAndPassword(auth, values.email, values.password)
    };

    // Logout the user
    const logOut = async () => {
        setUser({ email: null, uid: null });
        return await signOut(auth);
    };

    const googleLogin = async () => {
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const isNew =
                user.metadata.creationTime === user.metadata.lastSignInTime;
            if (isNew) {
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    uid: user.uid,
                });
            }
        } catch (error: any) {
            return error;
        }
    };

    
    const microsoftLogin = async () => {
        const provider = new OAuthProvider('microsoft.com');;

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const isNew =
                user.metadata.creationTime === user.metadata.lastSignInTime;
            if (isNew) {
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    uid: user.uid,
                });
            }
        } catch (error: any) {
            return error;
        }
    };
    
    const facebookLogin = async () => {
        const provider = new FacebookAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const isNew =
                user.metadata.creationTime === user.metadata.lastSignInTime;
            if (isNew) {
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    uid: user.uid,
                });
            }
        } catch (error: any) {
            return error;
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, signUp, logIn, googleLogin,microsoftLogin,facebookLogin, logOut }}
        >
            {loading ? null : children}
        </AuthContext.Provider>
    );
};
