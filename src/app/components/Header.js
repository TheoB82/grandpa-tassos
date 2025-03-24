"use client";
import React from "react";
import MobileHeader from "./MobileHeader"; // Import the MobileHeader component
import { useLanguage } from "../context/LanguageContext";
import { categoryMapping } from "../../utils/categoryMapping";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  const { language } = useLanguage();

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden">
        <MobileHeader />
      </div>

      {/* Desktop Header */}
      <header className="hidden lg:flex w-full p-4 bg-white text-gray-900 fixed top-0 left-0 right-0 shadow-md z-50">
        {/* Desktop Navigation */}
        <nav className="flex flex-1 justify-start ml-20">
          <ul className="flex space-x-6 text-lg font-semibold tracking-tight">
            <li>
              <span className="text-gray-700 hover:text-blue-500 transition-colors duration-300 cursor-pointer">
                {language === "EN" ? "Recipes" : "Συνταγές"}
              </span>
            </li>
            <li>
              <Link href="/about" className="text-gray-700 hover:text-blue-500">
                {language === "EN" ? "About Grandpa" : "Σχετικά με τον Παππού"}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-700 hover:text-blue-500">
                {language === "EN" ? "Contact" : "Επικοινωνία"}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Center - Logo */}
        <div className="flex justify-center flex-1 items-center">
          <Link href="/" className="block">
            <Image src="/images/logo.png" alt="Grandpa Tassos Logo" className="h-32" width={128} height={128} />
          </Link>
        </div>

        {/* Right Section - Language Selector and Social Icons */}
        <div className="flex-1 flex justify-end items-center space-x-6 mr-4">
          {/* Language Selector */}
          <div className="flex space-x-4">
            <button
              className={`hover:text-blue-500 ${language === "EN" ? "font-bold text-blue-600" : ""}`}
              onClick={() => handleLanguageChange("EN")}
            >
              EN
            </button>
            <button
              className={`hover:text-blue-500 ${language === "GR" ? "font-bold text-blue-600" : ""}`}
              onClick={() => handleLanguageChange("GR")}
            >
              ΕΛ
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4">
            <a
              href="https://www.youtube.com/channel/UC9Y7UEg7WItFJOsV2UNqZ9Q"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500"
            >
              <FaYoutube size={24} />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100089479543703"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://www.instagram.com/grandpatazzos/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500"
            >
              <FaInstagram size={24} />
            </a>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;