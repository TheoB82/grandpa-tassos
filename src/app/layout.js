"use client"; // Ensure this file runs on the client side
import "../styles/globals.css";
import { LanguageProvider } from "./context/LanguageContext"; // Correct path
import Header from "./components/Header"; // Corrected path relative to src/app

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
  <link
    href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Mynerve&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Quicksand:wght@300..700&display=swap"
    rel="stylesheet"
  />
</head>

      <body className="antialiased">
        <LanguageProvider>
          <Header />
          <div className="pt-52">{children}</div>
        </LanguageProvider>
      </body>
    </html>
  );
}