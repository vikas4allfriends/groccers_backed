import localFont from "next/font/local";
import "./globals.css";
import Providers from "../redux/provider";
import LogoutHandler from '../components/LogoutHandler';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "My App",
  description: "Welcome to my Next.js 14 app",
};

export default function RootLayout({ children }) {
  console.log('RootLayout render')
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
