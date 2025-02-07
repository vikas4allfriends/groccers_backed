import localFont from "next/font/local";
import "../globals.css";
import Providers from "../../redux/provider";
import LoadingOverLay from "../../components/LoadingOverLay";

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

export const metadata = {
  title: "Authentication",
  description: "Login and Signup",
};

export default function AuthLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <LoadingOverLay>{children}</LoadingOverLay>
        </Providers>
      </body>
    </html>
  );
}
