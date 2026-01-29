import Chatbot from "@/components/Chatbot";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Sidebar>{children}<Chatbot/> </Sidebar>
      </body>
    </html>
  );
}