"use client"; 

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import Header from "../components/Header";

const ContactPage = () => {
  const { language } = useLanguage();
  const router = useRouter();

  // Use useEffect to ensure this logic only runs on the client side
  useEffect(() => {
    if (language === "GR" && window.location.pathname === "/contact") {
      router.push("/epikoinonia"); // Redirect to Greek version
    } else if (language === "EN" && window.location.pathname === "/epikoinonia") {
      router.push("/contact"); // Redirect to English version
    }
  }, [language, router]);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-16 px-6 text-gray-900">
        <h1 className="text-4xl font-bold text-center mb-6">
          {language === "EN" ? "Contact" : "Επικοινωνία"}
        </h1>
        <p className="text-lg leading-relaxed text-gray-700">
          {language === "EN"
            ? "My dear friends, if you are up for a conversation, if you want to share your own recipes or photos, if you want to discuss ideas and little secrets around our favorite topic or just read without participating, you are welcome on our Facebook page!"
            : `Φίλοι μου καλοί, αν έχετε όρεξη για κουβέντα, αν θέλετε να μοιραστείτε δικές σας συνταγές ή φωτογραφίες, αν θέλετε να συζητήσουμε ιδέες και μικρά μυστικά γύρω από το αγαπημένο μας θέμα ή απλά να διαβάζετε χωρίς να συμμετέχετε είστε ευπρόσδεκτοι στην παρεούλα μας στο Facebook!`}
        </p>

        <p className="text-lg leading-relaxed text-gray-700 mt-4">
          {language === "EN"
            ? "The Company of grandfather Tasos"
            : `Η Παρέα του παππού Τάσου`}
        </p>

        <p className="text-lg leading-relaxed text-gray-700 mt-4">
          {language === "EN"
            ? "I am very happy to receive your messages and comments and it makes me really happy to see you sharing my recipes! So I look forward to meeting you via a post, wherever you are!"
            : `Χαίρομαι πάρα πολύ να λαμβάνω μηνύματα και σχόλια σας και όταν βλέπω να μοιράζεστε και να κοινοποιείτε τις συνταγές μου τότε να δείτε! Σαν μικρό παιδί κάνω! Περιμένω λοιπόν να σας συναντήσω σε κάποια ανάρτηση, όπου κι αν συχνάζετε!`}
        </p>

        <p className="text-lg leading-relaxed text-gray-700 mt-4">
          {language === "EN"
            ? "If you spot a mistake on the page or want to email me my email is grandpatassos@gmail.com"
            : `Αν εντοπίσετε κάποιο λάθος στην σελίδα ή θέλετε να μου στείλετε εμαίλ το ηλεκτρονικό μου ταχυδρομείο είναι grandpatassos@gmail.com`}
        </p>

        <p className="text-lg leading-relaxed text-gray-700 text-center mt-4">
          {language === "EN"
            ? "Contact Grandpa Tasso"
            : `Επικοινωνήστε με τον παππού Τάσο`}
        </p>
      </main>
    </div>
  );
};

export default ContactPage;
