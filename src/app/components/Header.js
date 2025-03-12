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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Fetch recipes data
  useEffect(() => {
    fetch("/recipes.json")
      .then((response) => response.json())
      .then((data) => setSearchResults(data))
      .catch((error) => console.error("Error loading recipes:", error));
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = searchResults.filter((recipe) =>
      [recipe[`Title${language}`], recipe[`ShortDescription${language}`], recipe[`Tags${language}`]]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    setSearchResults(filtered);
  }, [searchQuery, language, searchResults]);

  const handleRecipeClick = (recipe) => {
    router.push(`/recipes/${recipe.TitleEN.replace(/\s+/g, "-").toLowerCase()}`);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <header className="w-full p-4 bg-white text-gray-900 flex items-end justify-between fixed top-0 left-0 right-0 shadow-md z-50">
      {/* Left - Navigation */}
      <nav className="flex-1 flex justify-start ml-20">
        <ul className="flex space-x-6 text-lg font-semibold tracking-tight">
          {/* Recipes Dropdown */}
          <li
            className="relative"
            ref={dropdownRef}
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <span className="text-gray-700 hover:text-blue-500 transition-colors duration-300">
              {language === "EN" ? "Recipes" : "Συνταγές"}
            </span>
            {isDropdownOpen && (
              <ul className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-md z-50">
                {categoryMapping[language].map((category) => (
                  <li key={category.path} className="p-2 hover:bg-gray-100 cursor-pointer">
                    <Link href={`/recipes/${category.path}`}>{category.name}</Link>
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

      {/* Center - Logo */}
      <div className="flex justify-center flex-1 items-end">
        <Link href="/">
          <Image src="/images/logo.png" alt="Grandpa Tassos Logo" width={128} height={128} />
        </Link>
      </div>

      {/* Right - Search, Language Selector, Socials */}
      <div className="flex-1 flex justify-end items-end space-x-6 mr-4 relative">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder={language === "EN" ? "Search recipes..." : "Αναζήτηση συνταγών..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchResults.length > 0 && (
            <ul className="absolute left-0 mt-2 w-full bg-white border border-gray-300 shadow-lg rounded-md z-50">
              {searchResults.map((recipe) => (
                <li
                  key={recipe.TitleEN}
                  onClick={() => handleRecipeClick(recipe)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {recipe[`Title${language}`]}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Language Selector */}
        <div className="flex space-x-2">
          <button
            onClick={() => handleLanguageChange("EN")}
            className={`px-3 py-1 border rounded-md ${
              language === "EN" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => handleLanguageChange("GR")}
            className={`px-3 py-1 border rounded-md ${
              language === "GR" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            ΕΛ
          </button>
        </div>

        {/* Social Media Icons */}
<div className="flex space-x-4">
  <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
    <FaYoutube className="text-red-600 text-2xl hover:scale-110 transition-transform" />
  </a>
  <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
    <FaFacebook className="text-blue-600 text-2xl hover:scale-110 transition-transform" />
  </a>
  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
    <FaInstagram className="text-pink-500 text-2xl hover:scale-110 transition-transform" />
  </a>
</div>
      </div>
    </header>
  );
};

export default Header;
