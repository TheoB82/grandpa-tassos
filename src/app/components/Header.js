"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaYoutube, FaFacebook, FaInstagram, FaBars, FaTimes } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { useRouter } from "next/navigation";
import { categoryMapping } from '../../utils/categoryMapping';
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  const { language, handleLanguageChange } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/recipes.json")
      .then((response) => response.json())
      .then((data) => Array.isArray(data) ? setRecipes(data) : console.error("Invalid data"))
      .catch((error) => console.error("Error loading recipes:", error));
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) return setSearchResults([]);
    const filtered = recipes.filter((recipe) =>
      [recipe[`Title${language}`], recipe[`ShortDescription${language}`], recipe[`Tags${language}`]]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
  }, [searchQuery, language, recipes]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsDropdownOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target)) setSearchResults([]);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRecipeClick = (recipe) => {
    if (recipe && recipe.TitleEN) {
      router.push(`/recipes/${recipe.TitleEN.replace(/\s+/g, "-").toLowerCase()}`);
      setSearchQuery("");
      setSearchResults([]);
      setIsMobileMenuOpen(false); // Close menu on mobile
    }
  };

  return (
    <header className="w-full bg-white text-gray-900 fixed top-0 left-0 shadow-md z-50">
      {/* Top Bar: Logo Centered, Language + Social + Search Right */}
      <div className="flex items-center justify-between p-4 md:px-20">
        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Logo Centered */}
        <Link href="/" className="mx-auto md:mx-0">
          <Image src="/images/logo.png" alt="Grandpa Tassos Logo" className="h-20 w-auto" width={80} height={80} />
        </Link>

        {/* Language + Social + Search (Always Visible) */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Language Toggle */}
          <div className="flex space-x-2">
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

          {/* Social Icons (Hide on Mobile) */}
          <div className="hidden md:flex space-x-2">
            <Link href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
              <FaYoutube className="text-red-600 text-xl hover:scale-110 transition-transform" />
            </Link>
            <Link href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="text-blue-600 text-xl hover:scale-110 transition-transform" />
            </Link>
            <Link href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-pink-500 text-xl hover:scale-110 transition-transform" />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative" ref={searchRef}>
            <input
              type="text"
              placeholder={language === "EN" ? "Search..." : "Αναζήτηση..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-36 md:w-64 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            {searchResults.length > 0 && (
              <ul className="absolute left-0 mt-2 w-full bg-white border border-gray-300 shadow-lg rounded-md z-50 max-h-60 overflow-y-auto">
                {searchResults.map((recipe) => (
                  <li
                    key={recipe.TitleEN}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleRecipeClick(recipe)}
                  >
                    <div className="font-semibold">{recipe[`Title${language}`]}</div>
                    <div className="text-sm text-gray-600">{recipe[`ShortDescription${language}`]}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Menu - Desktop Always Visible */}
      <nav className="hidden md:flex justify-center border-t border-gray-200 py-2 space-x-8 text-lg font-semibold tracking-tight">
        <div className="relative" ref={dropdownRef}>
          <span
            className="text-gray-700 hover:text-blue-500 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {language === "EN" ? "Recipes" : "Συνταγές"}
          </span>
          {isDropdownOpen && (
            <ul className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-md z-50">
              {categoryMapping[language]?.map((category) => (
                <li
                  key={category.path}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    router.push(category.path);
                    setIsDropdownOpen(false);
                  }}
                >
                  {category.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Link href="/about" className="text-gray-700 hover:text-blue-500">
          {language === "EN" ? "About Grandpa" : "Σχετικά με τον Παππού"}
        </Link>
        <Link href="/contact" className="text-gray-700 hover:text-blue-500">
          {language === "EN" ? "Contact" : "Επικοινωνία"}
        </Link>
      </nav>

      {/* Navigation Menu - Mobile (Hamburger Dropdown) */}
      {isMobileMenuOpen && (
        <nav className="md:hidden px-4 pb-4">
          <ul className="flex flex-col space-y-2 text-lg font-semibold">
            <li className="relative" ref={dropdownRef}>
              <span
                className="text-gray-700 hover:text-blue-500 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {language === "EN" ? "Recipes" : "Συνταγές"}
              </span>
              {isDropdownOpen && (
                <ul className="mt-2 w-full bg-white border border-gray-300 shadow-lg rounded-md z-50">
                  {categoryMapping[language]?.map((category) => (
                    <li
                      key={category.path}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        router.push(category.path);
                        setIsDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {category.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {language === "EN" ? "About Grandpa" : "Σχετικά με τον Παππού"}
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
