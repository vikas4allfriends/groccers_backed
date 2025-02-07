"use client";

import { usePathname } from 'next/navigation';
import SideBar from '../components/SideBar'
// import { useRouter } from "next/navigation";
import { useEffect } from 'react';

export default function SidebarLayout({ children }) {

    const pathname = usePathname();
    // const router = useRouter();
    // console.log('router==', router)
    // Define routes where the sidebar should be hidden
    // const hideSidebarRoutes = ['/Login', '/Signup'];
    // const showSidebar = !hideSidebarRoutes.includes(pathname);

    // useEffect(() => {
    //     const token = JSON.parse(localStorage.getItem('token'));
    //     console.log('token===', token)
    // }, []);

    return (
        <div style={{ display: 'flex' }}>
            {/* Sidebar */}
            {/* {showSidebar && */}
                <aside style={{ width: '250px', backgroundColor: '#f4f4f4' }}>
                    <SideBar />
                </aside>
            {/* } */}

            {/* Main Content */}
            <main style={{ flex: 1, padding: '20px' }}>
                {children}
            </main>
        </div>
    );
}
