"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaYoutube, FaFacebook, FaInstagram } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { useRouter } from "next/navigation";
import { categoryMapping } from "../../utils/categoryMapping";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const { language, handleLanguageChange } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  // Fetch recipes
  useEffect(() => {
    fetch("/recipes.json")
      .then((r) => r.json())
      .then((data) => setRecipes(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Debounced search
  const performSearch = useCallback(
    (query) => {
      if (!query.trim()) return setSearchResults([]);
      const filtered = recipes.filter((recipe) =>
        [
          recipe[`Title${language}`],
          recipe[`ShortDescription${language}`],
          recipe[`Tags${language}`]
        ]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    },
    [recipes, language]
  );

  useEffect(() => {
    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchQuery, performSearch]);

  // Close dropdowns on outside click
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

  const handleRecipeClick = (recipe, event) => {
    event?.preventDefault();
    const slug = recipe.TitleEN.replace(/\s+/g, "-").toLowerCase();
    setSearchQuery("");
    setSearchResults([]);
    setIsMenuOpen(false);
    router.push(`/recipes/${slug}`);
  };

  const handleCategoryClick = (path) => {
    router.push(path);
    setIsMenuOpen(false);
    setIsMobileDropdownOpen(false);
    setIsDropdownOpen(false);
  };

  // Highlight search matches
  const highlightText = (text, query) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const SearchResultsList = ({ results, isMobile = false }) => (
    <ul
      className={`absolute mt-2 bg-white border border-gray-300 shadow-lg rounded-md z-50 max-h-64 overflow-y-auto ${
        isMobile ? "left-0 w-full" : "left-0 w-72"
      }`}
    >
      {results.map((recipe) => (
        <li
          key={recipe.TitleEN}
          className="p-3 hover:bg-gray-100 cursor-pointer transition-colors border-b last:border-b-0"
          onClick={(e) => handleRecipeClick(recipe, e)}
        >
          <div className="font-semibold text-gray-900">
            {highlightText(recipe[`Title${language}`], searchQuery)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {recipe[`ShortDescription${language}`]?.substring(0, 60)}...
          </div>
        </li>
      ))}
      {results.length === 0 && searchQuery && (
        <li className="p-4 text-center text-gray-500">
          {language === "EN" ? "No recipes found" : "Δεν βρέθηκαν συνταγές"}
        </li>
      )}
    </ul>
  );

  return (
    <header className="w-full p-4 bg-white text-gray-900 fixed top-0 left-0 right-0 shadow-md z-50">
      {/* ------------------------- MOBILE HEADER ------------------------- */}
      <div className="lg:hidden flex justify-between items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-700 text-2xl"
        >
          &#9776;
        </button>

        <Link href="/" className="mx-auto">
          <Image
            src="/images/logo.png"
            alt="Grandpa Tassos"
            width={78}
            height={78}
            priority
          />
        </Link>

        <div className="flex space-x-2">
          <button
            className={`px-2 py-1 ${
              language === "EN" ? "font-bold text-blue-600" : ""
            }`}
            onClick={() => handleLanguageChange("EN")}
          >
            EN
          </button>
          <button
            className={`px-2 py-1 ${
              language === "GR" ? "font-bold text-blue-600" : ""
            }`}
            onClick={() => handleLanguageChange("GR")}
          >
            ΕΛ
          </button>
        </div>
      </div>

      {/* ------------------------- MOBILE MENU ------------------------- */}
      {isMenuOpen && (
        <>
          {/* Mobile Search */}
          <div className="lg:hidden mt-4 px-4 relative" ref={searchRef}>
            <input
              type="text"
              placeholder={language === "EN" ? "Search recipes..." : "Αναζήτηση..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {searchResults.length > 0 && (
              <SearchResultsList results={searchResults} isMobile />
            )}
          </div>

          {/* Mobile dropdown */}
          <div className="lg:hidden mt-4 bg-white border-t pt-4 px-4">
            <button
              className="block px-4 py-2 w-full text-left"
              onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
            >
              {language === "EN" ? "Recipes" : "Συνταγές"}
            </button>

            {isMobileDropdownOpen && (
              <ul className="space-y-2 pl-4 mt-2">
                {categoryMapping[language]?.map((cat) => (
                  <li
                    key={cat.path}
                    className="p-2 hover:bg-gray-100"
                    onClick={() => handleCategoryClick(cat.path)}
                  >
                    {cat.name}
                  </li>
                ))}
              </ul>
            )}

            <Link href="/about" className="block px-4 py-2 hover:bg-gray-100">
              {language === "EN" ? "About Grandpa" : "Ο Παππούς"}
            </Link>

            <Link href="/contact" className="block px-4 py-2 hover:bg-gray-100">
              {language === "EN" ? "Contact" : "Επικοινωνία"}
            </Link>
          </div>
        </>
      )}

      {/* ------------------------- DESKTOP HEADER ------------------------- */}
      <div className="hidden lg:flex items-center justify-center relative h-40">

        {/* TRUE CENTER LOGO */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/" aria-label="Home">
            <Image
              src="/images/logo.png"
              alt="Grandpa Tassos Logo"
              width={120}
              height={120}
              className="h-28 w-auto"
            />
          </Link>
        </div>

        {/* LEFT SIDE NAVIGATION */}
        <nav className="absolute left-10 flex items-center" ref={dropdownRef}>
          <ul className="flex space-x-6 text-lg font-semibold">
            <li
              className="relative cursor-pointer"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => {
                dropdownTimeoutRef.current = setTimeout(() => {
                  setIsDropdownOpen(false);
                }, 200);
              }}
            >
              <span className="hover:text-blue-500">
                {language === "EN" ? "Recipes" : "Συνταγές"}
              </span>

              {isDropdownOpen && (
                <ul className="absolute left-0 mt-2 bg-white border shadow-lg rounded-md w-48">
                  {categoryMapping[language]?.map((cat) => (
                    <li
                      key={cat.path}
                      className="p-2 hover:bg-gray-100"
                      onClick={() => handleCategoryClick(cat.path)}
                    >
                      {cat.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li>
              <Link href="/about" className="hover:text-blue-500">
                {language === "EN" ? "About Grandpa" : "Ο Παππούς"}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-500">
                {language === "EN" ? "Contact" : "Επικοινωνία"}
              </Link>
            </li>
          </ul>
        </nav>

        {/* RIGHT SIDE CONTENT */}
        <div className="absolute right-10 flex items-center space-x-6" ref={searchRef}>
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder={language === "EN" ? "Search..." : "Αναζήτηση..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            />
            {searchResults.length > 0 && (
              <SearchResultsList results={searchResults} />
            )}
          </div>

          {/* Language */}
          <div className="flex space-x-2">
            <button
              className={`px-2 ${
                language === "EN" ? "font-bold text-blue-600" : ""
              }`}
              onClick={() => handleLanguageChange("EN")}
            >
              EN
            </button>
            <button
              className={`px-2 ${
                language === "GR" ? "font-bold text-blue-600" : ""
              }`}
              onClick={() => handleLanguageChange("GR")}
            >
              ΕΛ
            </button>
          </div>

          {/* Socials */}
          <div className="flex space-x-4">
            <a
              href="https://www.youtube.com/@GrandpaTassoscooking"
              target="_blank"
            >
              <FaYoutube size={24} className="text-red-600 hover:text-blue-500" />
            </a>
            <a
              href="https://www.facebook.com/grandpatassoscooking"
              target="_blank"
            >
              <FaFacebook size={24} className="text-blue-600 hover:text-blue-500" />
            </a>
            <a
              href="https://www.instagram.com/grandpa_tassos_cooking/"
              target="_blank"
            >
              <FaInstagram size={24} className="text-pink-500 hover:text-blue-500" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
