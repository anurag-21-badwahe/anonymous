
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link";
// import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Feedonymous",
  description: "Generated by create next app",
  icons: {
    icon: "/favicon.svg", // public path
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { data: session } = useSession();
  // const username = session?.user?.name ? session.user.name.split(" ")[0] : "Guest";
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          {children}
          {/* <Navbar username={username} /> */}
          <div className="group fixed bottom-4 right-4 z-50">
            <Link
              href="/buy-me-a-coffee"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/buymeacoffee.png"
                alt="Buy Me a Coffee"
                className="w-14 h-14"
              />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white text-xs rounded py-1 px-2 absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                Buy Me a Coffee
              </span>
            </Link>
          </div>
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
