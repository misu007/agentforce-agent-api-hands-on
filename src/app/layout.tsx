import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agentforce Next.js Demo",
  description:
    "Next.js Demo app powered by Agentforce headless Agent via Agent API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-items-center h-screen p-0 gap-0 ">
          {children}
        </div>
      </body>
    </html>
  );
}
