"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from "@/components/Providers";

// This is the general profile page component that redirects to a specific profile
export default function Profile() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Check if there is a logged-in user
        if (user?.uid) {
            // Redirect to the specific profile page
            router.push(`/profile/${user.uid}`);
        } else {
            // Optionally, redirect unauthenticated users to login page
            router.push('/login');
        }
    }, [user, router]);

    // Show a loading message or component while the redirect is being processed
    return <div>Loading...</div>;
}
