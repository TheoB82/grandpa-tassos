import React, { useState } from 'react';
import { FaYoutube, FaFacebook, FaInstagram, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import Image from 'next/image';

export default function Header() {
  const { language, toggleLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      {/* Mobile Header */}
      <div className="flex items-center justify-between px-4 py-2 md:hidden relative">
        {/* Hamburger Menu - Left */}
        <button onClick={toggleMenu} className="text-gray-700 text-xl">
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Logo - Center */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Image src="/images/logo.png" alt="Logo" width={100} height={40} />
        </div>

        {/* Search + Language Toggle - Right */}
        <div className="flex items-center space-x-3">
          <FaSearch className="text-gray-700 text-lg" />
          <button onClick={toggleLanguage} className="text-sm font-semibold text-gray-700">
            {language === 'en' ? 'ΕΛ' : 'EN'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white px-4 py-2 border-t">
          <ul className="flex flex-col space-y-2 text-lg font-medium text-gray-700">
            <li><Link href="/recipes" onClick={toggleMenu}>{language === 'en' ? 'Recipes' : 'Συνταγές'}</Link></li>
            <li><Link href="/about" onClick={toggleMenu}>{language === 'en' ? 'About Grandpa' : 'Ο Παππούς'}</Link></li>
            <li><Link href="/contact" onClick={toggleMenu}>{language === 'en' ? 'Contact' : 'Επικοινωνία'}</Link></li>
          </ul>
        </nav>
      )}

      {/* Desktop Header */}
      <div className="hidden md:flex flex-col items-center justify-center">
        {/* Logo Centered */}
        <div className="py-2">
          <Image src="/images/logo.png" alt="Logo" width={160} height={60} />
        </div>

        {/* Menu Bar */}
        <div className="w-full flex justify-between items-center px-8 py-2 border-t">
          {/* Menu Items */}
          <nav>
            <ul className="flex space-x-6 text-lg font-semibold text-gray-700">
              <li><Link href="/recipes">{language === 'en' ? 'Recipes' : 'Συνταγές'}</Link></li>
              <li><Link href="/about">{language === 'en' ? 'About Grandpa' : 'Ο Παππούς'}</Link></li>
              <li><Link href="/contact">{language === 'en' ? 'Contact' : 'Επικοινωνία'}</Link></li>
            </ul>
          </nav>

          {/* Right Section: Social Icons + Search + Language */}
          <div className="flex items-center space-x-4">
            <FaSearch className="text-gray-700 text-lg cursor-pointer" />
            <button onClick={toggleLanguage} className="text-sm font-semibold text-gray-700">
              {language === 'en' ? 'ΕΛ' : 'EN'}
            </button>
            <a href="https://youtube.com" target="_blank"><FaYoutube className="text-red-600 text-xl hover:scale-110" /></a>
            <a href="https://facebook.com" target="_blank"><FaFacebook className="text-blue-600 text-xl hover:scale-110" /></a>
            <a href="https://instagram.com" target="_blank"><FaInstagram className="text-pink-500 text-xl hover:scale-110" /></a>
          </div>
        </div>
      </div>
    </header>
  );
}
