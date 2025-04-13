import "../styles/globals.css";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import Header from "./components/Header";
import CookieBanner from "./components/CookieBanner";

// Use a wrapper component to access language context
function HTMLWrapper({ children }) {
  const { language } = useLanguage();

  return (
    <html lang={language === "GR" ? "el" : "en"}>
      <head>
        {/* Google Fonts including Mynerve for Greek */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Mynerve&family=Quicksand:wght@400;700&display=swap"
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
        <Header />
        <div className="pt-52">{children}</div>
        <CookieBanner />
      </body>
    </html>
  );
}

export const metadata = {
  title: "Grandpa Tassos",
  description: "Authentic Greek recipes passed down through generations.",
};

export default function RootLayout({ children }) {
  return (
    <LanguageProvider>
      <HTMLWrapper>{children}</HTMLWrapper>
    </LanguageProvider>
  );
}
