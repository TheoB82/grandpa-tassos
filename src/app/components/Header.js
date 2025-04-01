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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Desktop dropdown
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false); // Mobile dropdown for categories
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const router = useRouter();
  const dropdownTimeoutRef = useRef(null);


  useEffect(() => {
    fetch("/recipes.json")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
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
    if (recipe?.TitleEN) {
      const slug = recipe.TitleEN.replace(/\s+/g, "-").toLowerCase(); // Generate the slug
      console.log("Navigating to:", `/recipes/${slug}`); // Debugging log
      router.push(`/recipes/${slug}`); // Navigate to the recipe page
      setSearchQuery(""); // Clear the search query
      setSearchResults([]); // Clear the search results
      setIsMenuOpen(false); // Close the mobile menu
    } else {
      console.error("Invalid recipe clicked:", recipe);
    }
  };

  const handleCategoryClick = (categoryPath) => {
    if (categoryPath) {
      router.push(categoryPath);
      setIsMenuOpen(false); // Close mobile menu after navigation
      setIsDropdownOpen(false);
      setIsMobileDropdownOpen(false);
    }
  };

  return (
    <header className="w-full p-4 bg-white text-gray-900 fixed top-0 left-0 right-0 shadow-md z-50">
     {/* Mobile View */}
<div className="lg:hidden flex justify-between items-center">
  {/* Burger Menu Button */}
  <button
    onClick={() => setIsMenuOpen(!isMenuOpen)}
    className="text-gray-700 text-2xl"
  >
    &#9776;
  </button>

  {/* Logo Centered */}
  <Link href="/" className="mx-auto">
    <Image src="/images/logo.png" alt="Grandpa Tassos Logo" width={78} height={78} />
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

{/* Mobile Search Bar */}
{isMenuOpen && (
  <div className="lg:hidden mt-4 px-4">
    <input
      type="text"
      placeholder={language === "EN" ? "Search recipes..." : "Αναζήτηση συνταγών..."}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {searchResults.length > 0 && (
      <ul className="mt-2 bg-white border border-gray-300 shadow-lg rounded-md z-50 max-h-64 overflow-y-auto">
        {searchResults.map((recipe) => (
          <li
            key={recipe.TitleEN}
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleRecipeClick(recipe)} // Call the updated function
          >
            <div className="font-semibold">{recipe[`Title${language}`]}</div>
            <div className="text-sm text-gray-600">{recipe[`ShortDescription${language}`]}</div>
          </li>
        ))}
      </ul>
    )}
  </div>
)}

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 bg-white border-t border-gray-200 pt-4">
          <div className="relative">
            <button
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
            >
              {language === "EN" ? "Recipes" : "Συνταγές"}
            </button>
            {isMobileDropdownOpen && (
              <ul className="space-y-2 pl-4">
                {categoryMapping[language]?.map((category) => (
                  <li key={category.path} className="p-2 hover:bg-gray-100">
                    <Link href={category.path} onClick={() => handleCategoryClick(category.path)}>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Link href="/about" className="block px-4 py-2 hover:bg-gray-100">
            {language === "EN" ? "About Grandpa" : "Σχετικά με τον Παππού"}
          </Link>
          <Link href="/contact" className="block px-4 py-2 hover:bg-gray-100">
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
        <Link
          href="/about"
          className="relative text-gray-700 hover:text-blue-500 transition-colors duration-300 
            after:block after:absolute after:left-1/2 after:bottom-0 after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full hover:after:left-0"
        >
          {language === "EN" ? "About Grandpa" : "Σχετικά με τον Παππού"}
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
<div className="flex justify-center flex-1 items-center mr-22"> {/* Add margin-right to shift it left */}
  <Link href="/" className="block">
    <Image
      src="/images/logo.png"
      alt="Grandpa Tassos Logo"
      className="h-32 flip-logo"
      width={128}
      height={128}
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

          {/* Social Icons */}
<div className="flex space-x-4">
  <a href="https://www.youtube.com/@GrandpaTassoscooking" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-blue-500">
    <FaYoutube size={24} />
  </a>
  <a href="https://www.facebook.com/grandpatassoscooking" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
    <FaFacebook size={24} />
  </a>
  <a href="https://www.instagram.com/grandpa_tassos_cooking/" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-blue-500">
    <FaInstagram size={24} />
  </a>
</div>
        </div>
      </div>
    </header>
  );
};

export default Header;