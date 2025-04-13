import "../styles/globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import Header from "./components/Header";
import CookieBanner from "./components/CookieBanner";

export const metadata = {
  title: "Grandpa Tassos",
  description: "Authentic Greek recipes passed down through generations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Quicksand:wght@400;700&display=swap"
          rel="stylesheet"
        />
        
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2171074805444072"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="antialiased">
        <LanguageProvider>
          <Header />
          <div className="pt-52">{children}</div>
          <CookieBanner />
        </LanguageProvider>
      </body>
    </html>
  );
}
