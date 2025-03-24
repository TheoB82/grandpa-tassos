"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";
import { FaYoutube, FaFacebook, FaInstagram } from "react-icons/fa";

const Header = () => {
  const { language, handleLanguageChange } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white text-gray-900 fixed top-0 left-0 right-0 shadow-md z-50 overflow-hidden">
      {/* Mobile Header */}
      <div className="flex justify-between items-center p-4 lg:hidden">
        {/* Left - Burger Menu */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-2xl text-gray-700">
          &#9776;
        </button>

        {/* Center - Logo */}
        <Link href="/" className="mx-auto">
          <Image src="/images/logo.png" alt="Grandpa Tassos Logo" width={48} height={48} />
        </Link>

        {/* Right - Language Selector */}
        <div className="flex space-x-2">
          <button
            className={`text-sm ${language === "EN" ? "font-bold text-blue-600" : "text-gray-700"}`}
            onClick={() => handleLanguageChange("EN")}
          >
            EN
          </button>
          <button
            className={`text-sm ${language === "GR" ? "font-bold text-blue-600" : "text-gray-700"}`}
            onClick={() => handleLanguageChange("GR")}
          >
            ΕΛ
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md border-t border-gray-200 z-50 lg:hidden">
          <ul className="flex flex-col items-start p-4 space-y-2 text-lg">
            <li>
              <Link href="/recipes" onClick={() => setIsMenuOpen(false)}>
                {language === "EN" ? "Recipes" : "Συνταγές"}
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={() => setIsMenuOpen(false)}>
                {language === "EN" ? "About Grandpa" : "Σχετικά με τον Παππού"}
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                {language === "EN" ? "Contact" : "Επικοινωνία"}
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Desktop Header */}
      <div className="hidden lg:flex flex-col items-center w-full">
        {/* Logo Centered */}
        <div className="py-4">
          <Link href="/">
            <Image src="/images/logo.png" alt="Grandpa Tassos Logo" width={64} height={64} />
          </Link>
        </div>

        {/* Menu and Right Section */}
        <div className="flex justify-between items-center w-full px-8 pb-4">
          {/* Navigation Menu */}
          <nav>
            <ul className="flex space-x-6 text-lg font-semibold">
              <li>
                <Link
                  href="/recipes"
                  className="relative text-gray-700 after:block after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 after:ease-in-out after:mx-auto hover:after:w-full"
                >
                  {language === "EN" ? "Recipes" : "Συνταγές"}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="relative text-gray-700 after:block after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 after:ease-in-out after:mx-auto hover:after:w-full"
                >
                  {language === "EN" ? "About Grandpa" : "Σχετικά με τον Παππού"}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="relative text-gray-700 after:block after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 after:ease-in-out after:mx-auto hover:after:w-full"
                >
                  {language === "EN" ? "Contact" : "Επικοινωνία"}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right - Social Icons & Language */}
          <div className="flex items-center space-x-4">
            {/* Social Media Icons */}
            <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="text-xl text-gray-700 hover:text-red-600">
              <FaYoutube />
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-xl text-gray-700 hover:text-blue-600">
              <FaFacebook />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-xl text-gray-700 hover:text-pink-500">
              <FaInstagram />
            </a>

            {/* Language Selector */}
            <div className="flex space-x-2">
              <button
                className={`text-sm ${language === "EN" ? "font-bold text-blue-600" : "text-gray-700"}`}
                onClick={() => handleLanguageChange("EN")}
              >
                EN
              </button>
              <button
                className={`text-sm ${language === "GR" ? "font-bold text-blue-600" : "text-gray-700"}`}
                onClick={() => handleLanguageChange("GR")}
              >
                ΕΛ
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
