"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaYoutube, FaFacebook, FaInstagram, FaBars, FaTimes } from "react-icons/fa";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const router = useRouter();

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

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = recipes.filter((recipe) =>
      [recipe[`Title${language}`], recipe[`ShortDescription${language}`], recipe[`Tags${language}`]]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    setSearchResults(filtered);
  }, [searchQuery, language, recipes]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRecipeClick = (recipe) => {
    if (recipe && recipe.TitleEN) {
      router.push(`/recipes/${recipe.TitleEN.replace(/\s+/g, "-").toLowerCase()}`);
      setSearchQuery("");
      setSearchResults([]);
      setMobileMenuOpen(false);
    } else {
      console.error("Invalid recipe clicked:", recipe);
    }
  };

  const handleCategoryClick = (categoryPath) => {
    if (categoryPath) {
      router.push(`${categoryPath}`);
      setIsDropdownOpen(false);
      setMobileMenuOpen(false);
    } else {
      console.error("Invalid category clicked:", categoryPath);
    }
  };

  return (
    <header className="w-full p-4 bg-white text-gray-900 fixed top-0 left-0 right-0 shadow-md z-50">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="block">
          <Image src="/images/logo.png" alt="Grandpa Tassos Logo" className="h-20 w-auto" width={80} height={80} />
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-2xl text-gray-700">
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex flex-1 justify-start ml-20">
          <ul className="flex space-x-6 text-lg font-semibold tracking-tight">
            <li
              className="relative"
              ref={dropdownRef}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <span className="text-gray-700 hover:text-blue-500 transition-colors duration-300 cursor-pointer">
                {language === "EN" ? "Recipes" : "Συνταγές"}
              </span>
              {isDropdownOpen && (
                <ul
                  className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-md z-50"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
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

        {/* Right Section - Search, Language Selector, Socials */}
        <div className="hidden lg:flex flex-1 justify-end items-end space-x-6 mr-4 relative">
          {/* Search Bar */}
          <div className="relative" ref={searchRef}>
            <input
              type="text"
              placeholder={language === "EN" ? "Search recipes..." : "Αναζήτηση συνταγών..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchResults.length > 0 && (
              <ul className="absolute left-0 mt-2 w-72 bg-white border border-gray-300 shadow-lg rounded-md z-50 max-h-64 overflow-y-auto">
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

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <Link
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="text-red-600 text-2xl hover:scale-110 transition-transform" />
            </Link>
            <Link
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="text-blue-600 text-2xl hover:scale-110 transition-transform" />
            </Link>
            <Link
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="text-pink-500 text-2xl hover:scale-110 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 space-y-4">
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
            {/* Mobile Language Selector */}
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