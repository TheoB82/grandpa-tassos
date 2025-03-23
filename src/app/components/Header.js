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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
    } else {
      console.error("Invalid recipe clicked:", recipe);
    }
  };

  // Mobile Menu Toggle
  const handleBurgerClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle Search Bar on Mobile
  const handleSearchIconClick = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <header className="w-full p-4 bg-white text-gray-900 flex items-center justify-between fixed top-0 left-0 right-0 shadow-md z-50">
      {/* Mobile View - Burger Menu */}
      <div className="lg:hidden flex justify-between items-center w-full">
        {/* Burger Menu */}
        <div className="flex justify-start">
          <button onClick={handleBurgerClick}>
            <span className="text-gray-700 text-2xl">&#9776;</span>
          </button>
        </div>

        {/* Logo (Centered, Larger) */}
        <Link href="/" className="block mx-auto">
          <Image src="/images/logo.png" alt="Grandpa Tassos Logo" className="h-16" width={64} height={64} />
        </Link>

        {/* Right - Search Icon and Language Selector for Mobile */}
        <div className="flex justify-end space-x-4 items-center">
          <button onClick={handleSearchIconClick} className="text-gray-700 text-xl">
            🔍
          </button>
        </div>
      </div>

      {/* Desktop View */}
      <nav
        className={`hidden lg:flex flex-1 justify-center items-center ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="block mx-auto">
          <Image src="/images/logo.png" alt="Grandpa Tassos Logo" className="h-16" width={64} height={64} />
        </Link>

        {/* Menu Items */}
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

      {/* Right - Language Selector, Socials and Search for Desktop */}
      <div className="flex-1 flex flex-col justify-end items-end space-y-4 mr-4">
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

        {/* Search Icon for Desktop */}
        <div className="flex justify-end">
          <button onClick={handleSearchIconClick} className="text-gray-700 text-xl">
            🔍
          </button>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4 mt-2">
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

      {/* Search Bar on Desktop */}
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
    </header>
  );
};

export default Header;
