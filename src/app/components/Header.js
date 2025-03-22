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
  const [isMouseOverDropdown, setIsMouseOverDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/recipes.json")
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setRecipes(data));
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
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRecipeClick = (recipe) => {
    if (recipe && recipe.TitleEN) {
      router.push(`/recipes/${recipe.TitleEN.replace(/\s+/g, "-").toLowerCase()}`);
      setSearchQuery("");
      setSearchResults([]);
      setMobileMenuOpen(false);
    }
  };

  const handleCategoryClick = (categoryPath) => {
    if (categoryPath) {
      router.push(categoryPath);
      setIsDropdownOpen(false);
      setMobileMenuOpen(false);
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

        {/* Desktop Nav */}
        <nav className="hidden lg:flex flex-1 justify-center items-end ml-10">
          <ul className="flex space-x-6 text-lg font-semibold tracking-tight">
            <li
              className="relative"
              ref={dropdownRef}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <span className="text-gray-700 hover:text-blue-500 cursor-pointer">
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

        {/* Right Section - Search + Language + Social */}
        <div className="hidden lg:flex items-center space-x-4 relative" ref={searchRef}>
          <input
            type="text"
            placeholder={language === "EN" ? "Search recipes..." : "Αναζήτηση συνταγών..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchResults.length > 0 && (
            <ul className="absolute top-12 left-0 w-72 bg-white border border-gray-300 shadow-lg rounded-md z-50 max-h-64 overflow-y-auto">
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
          {/* Language Switch */}
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

          {/* Social Icons */}
          <div className="flex space-x-2 text-xl">
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-600">
              <FaYoutube />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
              <FaFacebook />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 space-y-4">
          <div className="flex flex-col space-y-2 text-lg font-semibold">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="text-left">
              {language === "EN" ? "Recipes" : "Συνταγές"}
            </button>
            {isDropdownOpen && (
              <ul className="pl-4 space-y-1">
                {categoryMapping[language]?.map((category) => (
                  <li key={category.path}>
                    <button onClick={() => handleCategoryClick(category.path)} className="text-left text-gray-700 hover:text-blue-500">
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/about" className="text-gray-700 hover:text-blue-500" onClick={() => setMobileMenuOpen(false)}>
              {language === "EN" ? "About Grandpa" : "Σχετικά με τον Παππού"}
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-500" onClick={() => setMobileMenuOpen(false)}>
              {language === "EN" ? "Contact" : "Επικοινωνία"}
            </Link>
          </div>

          {/* Mobile Search Bar */}
          <div className="relative mt-4" ref={searchRef}>
            <input
              type="text"
              placeholder={language === "EN" ? "Search recipes..." : "Αναζήτηση συνταγών..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchResults.length > 0 && (
              <ul className="absolute top-12 left-0 w-full bg-white border border-gray-300 shadow-lg rounded-md z-50 max-h-64 overflow-y-auto">
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

          {/* Language Switch & Social Icons */}
          <div className="flex justify-between items-center mt-4">
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
            <div className="flex space-x-2 text-xl">
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-600">
                <FaYoutube />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                <FaFacebook />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
