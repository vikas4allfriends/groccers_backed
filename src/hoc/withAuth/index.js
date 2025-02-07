'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent) => {
    return function AuthComponent(props) {
        const router = useRouter();

        useEffect(() => {
            const token = localStorage.getItem("token");
            console.log('withAuth token==', token)
            if (!token) {
                router.replace("/Login"); // Redirect if no token
            }
        }, [router]);

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
