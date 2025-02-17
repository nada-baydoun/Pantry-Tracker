import { Inter } from "next/font/google";
import { Pacifico } from 'next/font/google'
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
})
export const metadata = {
  title: "Pantry App Tracker",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={pacifico.className}>{children}</body>
    </html>
  );
}
