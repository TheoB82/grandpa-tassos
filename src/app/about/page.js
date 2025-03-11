import React from "react";
import Header from "../components/Header";

// Server-side logic to handle language-based redirection
export async function getServerSideProps({ req, res }) {
  const language = req.cookies.language || "EN"; // Get the language from cookies (or fallback to EN)

  if (language === "GR" && req.url === "/about") {
    return {
      redirect: {
        destination: "/sxetika", // Redirect to Greek version
        permanent: false,
      },
    };
  } else if (language === "EN" && req.url === "/sxetika") {
    return {
      redirect: {
        destination: "/about", // Redirect to English version
        permanent: false,
      },
    };
  }

  return {
    props: { language }, // Pass language to the page component
  };
}

const AboutPage = ({ language }) => {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-16 px-6 text-gray-900">
        <h1 className="text-4xl font-bold text-center mb-6">
          {language === "EN" ? "About Grandpa Tassos" : "Σχετικά με τον Παππού Τάσο"}
        </h1>
        <p className="text-lg leading-relaxed text-gray-700">
          {language === "EN"
            ? "Grandpa Tasos was born in 1955 in Katerini, Pieria. When he was three years old, he moved with his parents and three brothers to the village of Trilofos in Pieria where they lived until 1967 when they immigrated to Germany."
            : `Ο παππούς Τάσος γεννήθηκε το 1955 στην Κατερίνη Πιερίας. Όταν ήταν τριών ετών, 
               μετακόμισε με τους γονείς και τους τρεις αδερφούς του στο χωριό Τρίλοφος της Πιερίας 
               όπου έζησαν μέχρι το 1967 που μετανάστευσαν στη Γερμανία.`}
        </p>

        <p className="text-lg leading-relaxed text-gray-700 mt-4">
          {language === "EN"
            ? "In Germany he learned the art of fur making which was his job until 1988 when he returned back to Greece. During this period he completed his 28-month military service (1975 - 1978)."
            : `Στη Γερμανία έμαθε την τέχνη της γουνοποιίας που ήταν και η δουλειά του μέχρι το 1988 που επαναπατρίστηκε. 
               Στο διάστημα αυτό μεσολάβησε η 28μηνη στρατιωτική θητεία του (1975 - 1978).`}
        </p>

        <p className="text-lg leading-relaxed text-gray-700 mt-4">
          {language === "EN"
            ? "In 1988 in Greece, he engaged in the tourist professions and maintained a tourist office in Katerini until 2006."
            : `Το 1988 στην Ελλάδα πια, ασχολήθηκε με τα τουριστικά επαγγέλματα και διατηρούσε τουριστικό γραφείο 
               στην Κατερίνη μέχρι το 2006.`}
        </p>

        <p className="text-lg leading-relaxed text-gray-700 mt-4">
          {language === "EN"
            ? "In 2006, after the death of his wife Tula, he again left for Germany where he worked for a transport company. He has been retired since 2020 and now has more time to do the cooking he loves so much!"
            : `Το 2006 μετά τον θάνατο της συζύγου του Τούλας, ξανά έφυγε στη Γερμανία όπου εργάστηκε σε μεταφορική εταιρία. 
               Από το 2020 είναι συνταξιούχος και έχει πλέον περισσότερο χρόνο να ασχολείται με τις μαγειρικές που τόσο αγαπά!`}
        </p>

        <p className="text-lg leading-relaxed text-gray-700 mt-4">
          {language === "EN"
            ? "Grandpa has a daughter and two grandchildren living in Sweden and a son and a granddaughter living in England."
            : `Ο παππούς έχει μια κόρη και δυο εγγονούς που ζουν στην Σουηδία και έναν γιο και μια εγγονή που ζουν στην Αγγλία.`}
        </p>

        <p className="text-lg leading-relaxed text-gray-700 mt-4">
          {language === "EN"
            ? "He now lives in Germany with his partner and her mother, who are the lucky ones to taste everything he cooks!"
            : `Στην Γερμανία ζει τώρα πια με την σύντροφο του και την μητέρα της, οι οποίες είναι οι τυχερές που γεύονται όλα όσα μαγειρεύει!`}
        </p>    

        <p className="text-lg leading-relaxed text-gray-700 mt-4">
          {language === "EN"
            ? "Cooking has always been his great love and his first teacher was his mother, who when he was cooking and kneading had him by her side and showed him all her secrets."
            : `Η μαγειρική ήταν ανέκαθεν μεγάλη του αγάπη και πρώτη του δασκάλα υπήρξε η μητέρα του, 
               που όταν μαγείρευε και ζύμωνε τον είχε κοντά της και του έδειχνε όλα της τα μυστικά.`}
        </p>

        <p className="text-lg leading-relaxed text-gray-700 mt-4">
          {language === "EN"
            ? "Photography was also a great love of his and as he loves his gadgets, he always had a camera as well as a video camera. Even in times when camcorders needed a stroller to carry due to their size and weight!"
            : `Η φωτογραφία ήταν επίσης μια μεγάλη του αγάπη και σαν γκατζετάκιας που είναι, 
               είχε πάντα μια φωτογραφική μηχανή καθώς και βιντεοκάμερα. 
               Ακόμα και σε εποχές που οι βιντεοκάμερες χρειαζόταν καροτσάκι για να μεταφερθούν λόγω όγκου και βάρους!`}
        </p>

        <p className="text-lg leading-relaxed text-gray-700 mt-4">
          {language === "EN"
            ? "So he combined his two loves and became a great channel master on social media!"
            : `Συνδύασε λοιπόν τις δυό αγάπες του και έγινε μέγας καναλάρχης στα σόσιαλ μίντια!`}
        </p>

        <p className="text-lg leading-relaxed text-gray-700 mt-4">
          {language === "EN"
            ? "Not that he imagined it, of course, when he jokingly posted some recipes on YouTube that he would one day have so many friends watching his videos!"
            : `Ούτε που το φανταζόταν φυσικά, όταν για πλάκα έβαλε μερικές συνταγές στο γιουτουμπ ότι 
               θα είχε μια μέρα τόσους φίλους να παρακολουθούν τα βίντεο του!`}
        </p>

        <p className="text-lg leading-relaxed text-gray-700 mt-4">
          {language === "EN"
            ? "Grandpa cooks, records, edits and makes the meals all by himself! So if sometimes a message escapes him and he does not respond, know that it is because he struggles to catch up! He really wants you to communicate with him and share photos and ideas with him!"
            : `Ο παππούς μαγειρεύει, βιντεοσκοπεί, μοντάρει και κάνει και τη λάντζα ολομόναχος! 
               Οπότε αν καμιά φορά του ξεφύγει κάποιο μήνυμα και δεν απαντήσει, να ξέρετε πως είναι γιατί δεν προλαβαίνει! 
               Του αρέσει πολύ να επικοινωνείτε μαζί του και να μοιράζεστε μαζί του φωτογραφίες και ιδέες!`}
        </p>
      </main>
    </div>
  );
};

export default AboutPage;
