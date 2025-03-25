"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaYoutube, FaFacebook, FaInstagram } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { useRouter } from "next/navigation";
import { categoryMapping } from "../../utils/categoryMapping";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  const { language, handleLanguageChange } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const router = useRouter();

  // New state to manage the timeout for closing the dropdown
  const [dropdownTimeout, setDropdownTimeout] = useState(null);

  useEffect(() => {
    fetch("/recipes.json")
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setRecipes(data);
        } else {
          console.error("Invalid recipe data:", data);
        }
      })
      .catch((error) => console.error("Error loading recipes:", error));
  }, []);

  const handleDropdownEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
    }
    setIsDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => setIsDropdownOpen(false), 200); // Delay of 200ms
    setDropdownTimeout(timeout);
  };

  const handleCategoryClick = (category) => {
    router.push(`/${category.path}`);
    setIsDropdownOpen(false);
  };

  // Mouse enter and leave handlers for desktop menu
  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  return (
    <header className="w-full max-w-screen p-4 bg-white text-gray-900 fixed top-0 left-0 right-0 shadow-md z-50">
      {/* Mobile View */}
      <div className="lg:hidden flex justify-between items-center">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 text-2xl">
          &#9776;
        </button>

        {/* Logo Centered */}
        <Link href="/" className="mx-auto">
          <Image src="/images/logo.png" alt="Grandpa Tassos Logo" width={48} height={48} className="h-12 w-12 object-contain" />
        </Link>

        {/* Language Toggle */}
        <div className="flex items-center space-x-2">
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
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 space-y-2 bg-white border-t border-gray-200 pt-4">
          <div className="relative">
            <button
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle the dropdown
            >
              {language === "EN" ? "Recipes" : "Συνταγές"}
            </button>

            {isDropdownOpen && (
              <ul className="space-y-2 pl-4">
                {categoryMapping[language]?.map((category) => (
                  <li
                    key={category.path}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCategoryClick(category)} // Pass the category object to the handler
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Link href="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
            {language === "EN" ? "About Grandpa" : "Σχετικά με τον Παππού"}
          </Link>
          <Link href="/contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
            {language === "EN" ? "Contact" : "Επικοινωνία"}
          </Link>

          {/* Mobile Search */}
          <div className="px-4 mt-2">
            <input
              type="text"
              placeholder={language === "EN" ? "Search recipes..." : "Αναζήτηση συνταγών..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Social Icons */}
          <div className="flex justify-center space-x-4 mt-4">
            <a href="https://www.youtube.com/channel/UC9Y7UEg7WItFJOsV2UNqZ9Q" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaYoutube size={24} />
            </a>
            <a href="https://www.facebook.com/profile.php?id=100089479543703" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaFacebook size={24} />
            </a>
            <a href="https://www.instagram.com/grandpatazzos/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaInstagram size={24} />
            </a>
          </div>
        </div>
      )}

      {/* Desktop View - Navigation */}
      <nav className="hidden lg:flex flex-1 justify-start ml-20">
        <ul className="flex space-x-6 text-lg font-semibold tracking-tight">
          <li
            className="relative"
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="text-gray-700 hover:text-blue-500 transition-colors duration-300 cursor-pointer">
              {language === "EN" ? "Recipes" : "Συνταγές"}
            </span>
            {isDropdownOpen && (
              <ul
                className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-md z-50"
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                {categoryMapping[language] && categoryMapping[language].length > 0 ? (
                  categoryMapping[language].map((category) => (
                    <li
                      key={category.path}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCategoryClick(category)} // Use the correct category object
                    >
                      {category.name}
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500">No categories available</li>
                )}
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

      {/* Logo */}
      <Link href="/" className="mx-auto">
        <Image src="/images/logo.png" alt="Grandpa Tassos Logo" width={48} height={48} className="h-12 w-12 object-contain" />
      </Link>

      {/* Right Nav - Language and Social */}
      <div className="flex items-center space-x-4">
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

        <a href="https://www.youtube.com/channel/UC9Y7UEg7WItFJOsV2UNqZ9Q" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
          <FaYoutube size={24} />
        </a>
        <a href="https://www.facebook.com/profile.php?id=100089479543703" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
          <FaFacebook size={24} />
        </a>
        <a href="https://www.instagram.com/grandpatazzos/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
          <FaInstagram size={24} />
        </a>
      </div>
    </header>
  );
};

export default Header;
