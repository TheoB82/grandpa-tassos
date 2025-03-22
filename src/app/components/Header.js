"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";
import { FaFacebook, FaInstagram, FaYoutube, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const { language, toggleLanguage } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <header className="w-full bg-white shadow-md">
      {/* Logo Row (Centered Logo - Always) */}
      <div className="flex justify-center py-4">
        <Image
          src="/images/logo.png"
          alt="Grandpa Tassos Logo"
          width={160}
          height={160}
          className="object-contain"
        />
      </div>

      {/* Desktop Menu Row */}
      {!isMobile && (
        <div className="flex items-center justify-between px-8 md:px-20 py-2">
          {/* Menu Bar Centered */}
          <nav className="flex-1 flex justify-center">
            <ul className="flex space-x-8 text-lg font-semibold">
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
                  {language === "EN" ? "About Grandpa" : "Για τον Παππού"}
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

          {/* Language Toggle & Social Icons */}
          <div className="flex items-center space-x-6 ml-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="text-sm font-semibold text-gray-700 hover:text-blue-500"
            >
              {language === "EN" ? "ΕΛ" : "EN"}
            </button>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-red-600 transition"
              >
                <FaYoutube size={20} />
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-pink-500 transition"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Mobile View */}
      {isMobile && (
        <div className="flex items-center justify-between px-4 py-2">
          {/* Logo Left */}
          <Image
            src="/images/logo.png"
            alt="Grandpa Tassos Logo"
            width={120}
            height={120}
            className="object-contain"
          />

          {/* Hamburger Icon */}
          <button
            className="text-gray-700 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      )}

      {/* Mobile Language Toggle + Search Bar Always Visible */}
      {isMobile && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="text-sm font-semibold text-gray-700 hover:text-blue-500"
          >
            {language === "EN" ? "ΕΛ" : "EN"}
          </button>

          {/* Search Bar Placeholder */}
          <input
            type="text"
            placeholder={language === "EN" ? "Search..." : "Αναζήτηση..."}
            className="flex-1 mx-4 px-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none"
          />
        </div>
      )}

      {/* Mobile Menu Items Dropdown */}
      {isMobile && isMobileMenuOpen && (
        <nav className="bg-white shadow-md px-4 py-4 border-t border-gray-200">
          <ul className="flex flex-col space-y-4 text-lg font-semibold">
            <li>
              <Link
                href="/recipes"
                className="text-gray-700 hover:text-blue-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {language === "EN" ? "Recipes" : "Συνταγές"}
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {language === "EN" ? "About Grandpa" : "Για τον Παππού"}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-blue-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {language === "EN" ? "Contact" : "Επικοινωνία"}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
