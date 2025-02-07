"use client"; // Required for useEffect and useRouter

import localFont from "next/font/local";
import "../globals.css";
import SidebarLayout from "../SidebarLayout";
import Providers from "../../redux/provider";
import LoadingOverLay from "../../components/LoadingOverLay";
import {setRouter} from "../../utils/navigation";
import {useRouter} from 'next/navigation';

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const metadata = {
  title: "Main App",
  description: "Application Dashboard",
};

export default function MainLayout({ children }) {
  console.log("Main layout render")
  const router = useRouter();
  setRouter(router);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <SidebarLayout>
            <LoadingOverLay>
              {children}
            </LoadingOverLay>
          </SidebarLayout>
        </Providers>
      </body>
    </html>
  );
}
