"use client";

import { usePathname } from 'next/navigation';
import SideBar from '../components/SideBar'
// import { useRouter } from "next/navigation";
import { useEffect } from 'react';

export default function SidebarLayout({ children }) {


    return (
        <div style={{ display: 'flex' }}>
            {/* Sidebar */}
            {/* {showSidebar && */}
                <aside style={{ width: '250px', backgroundColor: '#f4f4f4' }}>
                    <SideBar />
                </aside>
            {/* } */}

            {/* Main Content */}
            {/* <main style={{ flex: 1, padding: '20px' }}> */}
                {children}
            {/* </main> */}
        </div>
    );
}
