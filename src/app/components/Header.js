"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaYoutube, FaFacebook, FaInstagram } from "react-icons/fa";
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
  const [dropdownTimeout, setDropdownTimeout] = useState(null);
  const [isMouseOverDropdown, setIsMouseOverDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    } else {
      console.error("Invalid recipe clicked:", recipe);
    }
  };

  // Moved outside handleCategoryClick
  const handleMouseEnter = () => {
    clearTimeout(dropdownTimeout);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      if (!isMouseOverDropdown) {
        setIsDropdownOpen(false);
      }
    }, 200); // Delay before closing
    setDropdownTimeout(timeout);
  };

  const handleCategoryClick = (categoryPath) => {
    if (categoryPath) {
      router.push(`${categoryPath}`);
    } else {
      console.error("Invalid category clicked:", categoryPath);
    }
  };

  const handleDropdownMouseEnter = () => {
    setIsMouseOverDropdown(true); // Mouse is inside the dropdown
  };

  const handleDropdownMouseLeave = () => {
    setIsMouseOverDropdown(false); // Mouse left the dropdown
  };

  // Toggle menu state for mobile view
  const handleBurgerClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full p-4 bg-white text-gray-900 flex items-center justify-between fixed top-0 left-0 right-0 shadow-md z-50">
      {/* Left - Navigation for Desktop */}
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
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
              >
                {categoryMapping[language] && categoryMapping[language].length > 0 ? (
                  categoryMapping[language].map((category) => (
                    <li
                      key={category.path}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCategoryClick(category.path)}
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

      {/* Center - Logo */}
      <div className="flex justify-center flex-1 items-center">
        <Link href="/" className="block">
          <Image src="/images/logo.png" alt="Grandpa Tassos Logo" className="h-32" width={128} height={128} />
        </Link>
      </div>

      {/* Right - Search, Language Selector, Socials */}
      <div className="flex-1 flex justify-end items-center space-x-6 mr-4 relative">
        {/* Search Bar */}
        <div className="relative hidden lg:block" ref={searchRef}>
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

      {/* Mobile View - Burger Menu */}
      <div className="lg:hidden flex justify-between items-center w-full p-4">
        <div className="flex justify-start">
          <button onClick={handleBurgerClick}>
            <span className="text-gray-700 text-2xl">&#9776;</span>
          </button>
        </div>

        {/* Logo */}
        <Link href="/" className="block">
          <Image src="/images/logo.png" alt="Grandpa Tassos Logo" className="h-16" width={64} height={64} />
        </Link>

        {/* Mobile Search & Language Toggle */}
        <div className="flex justify-end space-x-4">
          {/* Search Icon */}
          <div className="relative">
            <input
              type="text"
              placeholder={language === "EN" ? "Search recipes..." : "Αναζήτηση συνταγών..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
        </div>
      </div>

      {/* Mobile Menu - Visible if isMenuOpen is true */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-white shadow-md p-4 z-50">
          <ul>
            <li>
              <Link href="/about" className="block text-gray-700 py-2">About Grandpa</Link>
            </li>
            <li>
              <Link href="/contact" className="block text-gray-700 py-2">Contact</Link>
            </li>
            <li
              className="text-gray-700 py-2"
              onClick={() => handleCategoryClick("/recipes")}
            >
              {language === "EN" ? "Recipes" : "Συνταγές"}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
