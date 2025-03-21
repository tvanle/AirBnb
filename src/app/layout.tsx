import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/navbar/Navbar";
import ClientOnly from "@/app/components/ClientOnly";
import ToastContainerBar from "@/app/components/ToastContainerBar";
import SearchModal from "@/app/components/modals/SearchModal";
import RegisterModal from "./components/modals/RegisterModal";
import LoginModal from "./components/modals/LoginModal";
import getCurrentUser from "./actions/getCurrentUser";
import RentModal from "@/app/components/modals/RentModal";
import Footer from "@/app/components/Footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Airbnb",
    description: "Web for Airbnb",
};

export default async function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const currentUser = await getCurrentUser();
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientOnly>
            <ToastContainerBar />
            <SearchModal />
            <LoginModal/>
            <RegisterModal/>
            <RentModal />
            <Navbar currentUser = {currentUser}/>
        </ClientOnly>
        <div className="pb-20 pt-28">{children}</div>
        <Footer />
        </body>
        </html>
    );
}
