"use client";
import React, { useState, useRef } from "react";
import { FaYoutube, FaFacebook, FaInstagram } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { useRouter } from "next/navigation";
import { categoryMapping } from "../../utils/categoryMapping";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  const { language, handleLanguageChange } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const router = useRouter();

  const handleCategoryClick = (categoryPath) => {
    if (categoryPath) {
      router.push(`${categoryPath}`);
    } else {
      console.error("Invalid category clicked:", categoryPath);
    }
  };

  return (
    <header className="w-full p-4 bg-white text-gray-900 fixed top-0 left-0 right-0 shadow-md z-50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="block">
            <Image src="/images/logo.png" alt="Grandpa Tassos Logo" className="h-12 w-auto" width={128} height={128} />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-6 text-lg font-semibold">
          <ul className="flex space-x-6">
            <li
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <span className="text-gray-700 hover:text-blue-500 transition-colors duration-300 cursor-pointer">
                {language === "EN" ? "Recipes" : "Συνταγές"}
              </span>
              {isDropdownOpen && (
                <ul className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-md z-50">
                  {categoryMapping[language]?.map((category) => (
                    <li
                      key={category.path}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCategoryClick(category.path)}
                    >
                      {category.name}
                    </li>
                  ))}
                </ul>
              )}
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

        {/* Language Toggle */}
        <div className="hidden lg:flex space-x-4">
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

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-gray-700 hover:text-blue-500 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4">
          <ul className="space-y-4 text-lg font-semibold">
            <li>
              <span
                className="text-gray-700 hover:text-blue-500 transition-colors duration-300 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {language === "EN" ? "Recipes" : "Συνταγές"}
              </span>
              {isDropdownOpen && (
                <ul className="mt-2 space-y-2">
                  {categoryMapping[language]?.map((category) => (
                    <li
                      key={category.path}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCategoryClick(category.path)}
                    >
                      {category.name}
                    </li>
                  ))}
                </ul>
              )}
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
            {/* Mobile Language Toggle */}
            <li className="flex space-x-4">
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
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;