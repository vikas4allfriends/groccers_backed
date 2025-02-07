"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../redux/authSlice";

export default function LogoutHandler({token}) {
    const router = useRouter();
    const dispatch = useDispatch();
    const isLoggedOut = useSelector((state) => state.Auth_Data.isLoggedOut);
    // const token = useSelector((state) => state.Auth_Data.token);
    console.log('LogoutHandler token--', token)

    useEffect(() => {
        if (!token) {
            // localStorage.removeItem("token"); // ✅ Clear token
            // dispatch(logout()); // ✅ Ensure Redux state is updated

            // ✅ Force a full reload to unmount old layout and mount the new one
            window.location.replace("/auth/Login"); 
        }
    }, []);

    router.push('product/dashboard')
}
