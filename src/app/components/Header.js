'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { FaYoutube, FaFacebook, FaInstagram } from 'react-icons/fa';

export default function Header({ recipes }) {
  const { language, toggleLanguage } = useLanguage();

  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const handleResize = () => setIsMobile(window.innerWidth < 768);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    handleResize(); // set initial mobile state
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredCategories = Array.from(
    new Set(recipes.map((recipe) => recipe[`Category${language}`]))
  ).filter((category) =>
    category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="bg-white shadow-md p-4 flex flex-col items-center relative z-50">
      {/* Top Row: Social Icons + Logo + Language */}
      <div className="w-full flex items-center justify-between">
        {/* Social Icons */}
        <div className="flex space-x-4 ml-4">
          <a href="https://www.youtube.com/@GrandpaTassos" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <FaYoutube className="text-red-500 hover:text-red-700 text-2xl" />
          </a>
          <a href="https://www.facebook.com/people/Grandpa-Tassos/61551687937486/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebook className="text-blue-600 hover:text-blue-800 text-2xl" />
          </a>
          <a href="https://www.instagram.com/grandpatassos/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram className="text-pink-500 hover:text-pink-700 text-2xl" />
          </a>
        </div>

        {/* Logo */}
        <Link href="/">
          <img src="/images/logo.png" alt="Grandpa Tassos Logo" className="h-20 mx-auto" />
        </Link>

        {/* Language Toggle */}
        <div className="flex items-center space-x-2 mr-4">
          <button
            onClick={() => toggleLanguage('EN')}
            className={`text-sm font-semibold ${language === 'EN' ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-700`}
          >
            EN
          </button>
          <span className="text-gray-400">|</span>
          <button
            onClick={() => toggleLanguage('GR')}
            className={`text-sm font-semibold ${language === 'GR' ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-700`}
          >
            ΕΛ
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="w-full mt-4 flex items-center justify-center relative">
        {/* Mobile Burger */}
        {isMobile ? (
          <div className="flex items-center justify-between w-full px-4">
            <button onClick={toggleMenu} aria-label="Toggle Menu">
              <div className="space-y-1">
                <span className="block w-6 h-0.5 bg-gray-600"></span>
                <span className="block w-6 h-0.5 bg-gray-600"></span>
                <span className="block w-6 h-0.5 bg-gray-600"></span>
              </div>
            </button>
            {isMenuOpen && (
              <div className="absolute top-12 left-0 w-full bg-white shadow-md flex flex-col items-start p-4 space-y-2 z-10">
                <Link href="/recipes" className="text-gray-800 hover:text-blue-500 font-medium">{language === 'EN' ? 'Recipes' : 'Συνταγές'}</Link>
                <Link href="/about" className="text-gray-800 hover:text-blue-500 font-medium">{language === 'EN' ? 'About Grandpa' : 'Σχετικά με τον Παππού'}</Link>
                <Link href="/contact" className="text-gray-800 hover:text-blue-500 font-medium">{language === 'EN' ? 'Contact' : 'Επικοινωνία'}</Link>
              </div>
            )}
          </div>
        ) : (
          // Desktop Menu
          <ul className="flex space-x-10 text-lg font-semibold">
            <li>
              <Link href="/recipes" className="relative text-gray-700 after:block after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">
                {language === 'EN' ? 'Recipes' : 'Συνταγές'}
              </Link>
            </li>
            <li>
              <Link href="/about" className="relative text-gray-700 after:block after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">
                {language === 'EN' ? 'About Grandpa' : 'Σχετικά με τον Παππού'}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="relative text-gray-700 after:block after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">
                {language === 'EN' ? 'Contact' : 'Επικοινωνία'}
              </Link>
            </li>
          </ul>
        )}
      </nav>

      {/* Category Dropdown + Search */}
      <div className="mt-4 flex items-center space-x-4 w-full justify-center relative" ref={dropdownRef}>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {language === 'EN' ? 'Categories' : 'Κατηγορίες'}
          </button>
          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 bg-white shadow-md rounded w-64 max-h-64 overflow-y-auto z-10">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'EN' ? 'Search Categories' : 'Αναζήτηση Κατηγοριών'}
                className="w-full p-2 border-b border-gray-300 focus:outline-none"
                aria-label="Search Categories"
              />
              <ul className="p-2">
                {filteredCategories.map((category, index) => (
                  <li key={index} className="p-2 hover:bg-gray-100 cursor-pointer text-gray-700">
                    {category}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
