"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const router = useRouter();
  const dropdownTimeoutRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Fetch recipes
  useEffect(() => {
    setIsLoading(true);
    fetch("/recipes.json")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch recipes");
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRecipes(data);
          setError(null);
        } else {
          throw new Error("Invalid recipe data format");
        }
      })
      .catch((error) => {
        console.error("Error loading recipes:", error);
        setError(error.message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Debounced search function
  const performSearch = useCallback((query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

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
  }, [recipes, language]);

  // Debounced search with cleanup
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, performSearch]);

  // Click outside handlers
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

  // Cleanup dropdown timeout
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const handleRecipeClick = useCallback((recipe, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (recipe?.TitleEN) {
      const slug = recipe.TitleEN.replace(/\s+/g, "-").toLowerCase();
      setSearchQuery("");
      setSearchResults([]);
      setIsMenuOpen(false);
      router.push(`/recipes/${slug}`);
    } else {
      console.error("Invalid recipe clicked:", recipe);
    }
  }, [router]);

  const handleCategoryClick = useCallback((categoryPath) => {
    if (categoryPath) {
      router.push(categoryPath);
      setIsMenuOpen(false);
      setIsDropdownOpen(false);
      setIsMobileDropdownOpen(false);
    }
  }, [router]);

  // Highlight matching text in search results
  const highlightText = (text, query) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={index} className="bg-yellow-200">{part}</mark>
        : part
    );
  };

  const SearchResultsList = ({ results, isMobile = false }) => (
    <ul className={`absolute ${isMobile ? 'left-0' : 'left-0'} mt-2 ${isMobile ? 'w-full' : 'w-72'} bg-white border border-gray-300 shadow-lg rounded-md z-50 max-h-64 overflow-y-auto`}>
      {results.map((recipe) => (
        <li
          key={recipe.TitleEN}
          className="p-3 hover:bg-gray-100 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
          onClick={(event) => handleRecipeClick(recipe, event)}
          onTouchStart={(e) => {
            e.preventDefault();
            handleRecipeClick(recipe, e);
          }}
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
        <li className="p-4 text-gray-500 text-center">
          {language === "EN" ? "No recipes found" : "Δεν βρέθηκαν συνταγές"}
        </li>
      )}
    </ul>
  );

  return (
    <header className="w-full p-4 bg-white text-gray-900 fixed top-0 left-0 right-0 shadow-md z-50">
      {/* Mobile View */}
      <div className="lg:hidden flex justify-between items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-700 text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
          aria-label={language === "EN" ? "Toggle menu" : "Άνοιγμα μενού"}
          aria-expanded={isMenuOpen}
        >
          &#9776;
        </button>

        <Link href="/" className="mx-auto" aria-label="Home">
          <Image 
            src="/images/logo.png" 
            alt="Grandpa Tassos Logo" 
            width={78} 
            height={78}
            priority
          />
        </Link>

        <div className="flex items-center space-x-2">
          <button
            className={`hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 ${
              language === "EN" ? "font-bold text-blue-600" : ""
            }`}
            onClick={() => handleLanguageChange("EN")}
            aria-label="Switch to English"
          >
            EN
          </button>
          <button
            className={`hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 ${
              language === "GR" ? "font-bold text-blue-600" : ""
            }`}
            onClick={() => handleLanguageChange("GR")}
            aria-label="Αλλαγή σε Ελληνικά"
          >
            ΕΛ
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 px-4 relative" ref={searchRef}>
          <input
            type="text"
            placeholder={language === "EN" ? "Search recipes..." : "Αναζήτηση συνταγών..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={language === "EN" ? "Search recipes" : "Αναζήτηση συνταγών"}
          />
          {searchResults.length > 0 && <SearchResultsList results={searchResults} isMobile={true} />}
        </div>
      )}

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 bg-white border-t border-gray-200 pt-4 px-4">
          <div className="relative">
            <button
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left rounded transition-colors"
              onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
              aria-expanded={isMobileDropdownOpen}
            >
              {language === "EN" ? "Recipes" : "Συνταγές"}
            </button>
            {isMobileDropdownOpen && (
              <ul className="space-y-2 pl-4 mt-2">
                {categoryMapping[language]?.map((category) => (
                  <li key={category.path} className="p-2 hover:bg-gray-100 rounded transition-colors">
                    <Link href={category.path} onClick={() => handleCategoryClick(category.path)}>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Link href="/about" className="block px-4 py-2 hover:bg-gray-100 rounded transition-colors">
            {language === "EN" ? "About Grandpa" : "Ο Παππούς"}
          </Link>
          <Link href="/contact" className="block px-4 py-2 hover:bg-gray-100 rounded transition-colors">
            {language === "EN" ? "Contact" : "Επικοινωνία"}
          </Link>
        </div>
      )}

      {/* Desktop View */}
      <div className="hidden lg:flex items-center justify-between">
        {/* Left Nav */}
        <nav className="flex flex-1 justify-start ml-20 relative z-50">
          <ul className="flex space-x-6 text-lg font-semibold tracking-tight">
            <li
              className="relative"
              ref={dropdownRef}
              onMouseEnter={() => {
                clearTimeout(dropdownTimeoutRef.current);
                setIsDropdownOpen(true);
              }}
              onMouseLeave={() => {
                dropdownTimeoutRef.current = setTimeout(() => {
                  setIsDropdownOpen(false);
                }, 200);
              }}
            >
              <span className="relative text-gray-700 hover:text-blue-500 cursor-pointer transition-colors duration-300 
                after:block after:absolute after:left-1/2 after:bottom-0 after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full hover:after:left-0">
                {language === "EN" ? "Recipes" : "Συνταγές"}
              </span>
              {isDropdownOpen && (
                <ul className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-md z-50">
                  {categoryMapping[language]?.map((category) => (
                    <li
                      key={category.path}
                      className="p-2 hover:bg-gray-100 cursor-pointer transition-colors rounded"
                      onClick={() => handleCategoryClick(category.path)}
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
                className="relative text-gray-700 hover:text-blue-500 transition-colors duration-300 
                  after:block after:absolute after:left-1/2 after:bottom-0 after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full hover:after:left-0"
              >
                {language === "EN" ? "About Grandpa" : "Ο Παππούς"}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="relative text-gray-700 hover:text-blue-500 transition-colors duration-300 
                  after:block after:absolute after:left-1/2 after:bottom-0 after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full hover:after:left-0"
              >
                {language === "EN" ? "Contact" : "Επικοινωνία"}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logo Center */}
        <div className="flex justify-center flex-1 items-center mr-22">
          <Link href="/" className="block" aria-label="Home">
            <Image
              src="/images/logo.png"
              alt="Grandpa Tassos Logo"
              className="h-32 flip-logo"
              width={128}
              height={128}
              priority
            />
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex justify-end items-center space-x-6 mr-4 relative">
          {/* Search Bar */}
          <div className="relative" ref={searchRef}>
            <input
              type="text"
              placeholder={language === "EN" ? "Search recipes..." : "Αναζήτηση συνταγών..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={language === "EN" ? "Search recipes" : "Αναζήτηση συνταγών"}
            />
            {searchResults.length > 0 && <SearchResultsList results={searchResults} />}
          </div>

          {/* Language Selector */}
          <div className="flex space-x-4">
            <button
              className={`hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 ${
                language === "EN" ? "font-bold text-blue-600" : ""
              }`}
              onClick={() => handleLanguageChange("EN")}
              aria-label="Switch to English"
            >
              EN
            </button>
            <button
              className={`hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 ${
                language === "GR" ? "font-bold text-blue-600" : ""
              }`}
              onClick={() => handleLanguageChange("GR")}
              aria-label="Αλλαγή σε Ελληνικά"
            >
              ΕΛ
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4">
            <a 
              href="https://www.youtube.com/@GrandpaTassoscooking" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-red-600 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Visit our YouTube channel"
            >
              <FaYoutube size={24} />
            </a>
            <a 
              href="https://www.facebook.com/grandpatassoscooking" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Visit our Facebook page"
            >
              <FaFacebook size={24} />
            </a>
            <a 
              href="https://www.instagram.com/grandpa_tassos_cooking/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-pink-500 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Visit our Instagram profile"
            >
              <FaInstagram size={24} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;