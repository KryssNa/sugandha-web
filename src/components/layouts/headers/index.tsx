"use client";
import { CartIcon, CloseIcon, SearchIcon } from "@/utils/helpers/svgicon";
import { MenuIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface HeaderProps {
  className?: string;
}

type Language = "English" | "Japan" | "Eng";
type Currency = "USD" | "EUR" | "JPY";

const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  const pathname = usePathname();
  const [scroll, setScroll] = useState<boolean>(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("Eng");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("USD");
  const [menuActive, setMenuActive] = useState<boolean>(false);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.pageYOffset;
    if (currentScrollY > lastScrollY) {
      setScrollDirection("down");
    } else {
      setScrollDirection("up");
    }
    setScroll(currentScrollY > 150);
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let timeoutId: NodeJS.Timeout;

      const throttledScroll = () => {
        if (!timeoutId) {
          timeoutId = setTimeout(() => {
            handleScroll();
            // timeoutId = undefined;
          }, 100);
        }
      };

      window.addEventListener("scroll", throttledScroll);

      return () => {
        window.removeEventListener("scroll", throttledScroll);
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [handleScroll]);

  const handleLanguageChange = (language: Language) =>
    setSelectedLanguage(language);
  const handleCurrencyChange = (currency: Currency) =>
    setSelectedCurrency(currency);
  const handleMenuToggle = () => setMenuActive(!menuActive);

  const shouldShowHeader = scroll && scrollDirection === "up";

  return (
    <header className={`relative ${className}`}>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 
          ${
            menuActive ? "opacity-100 visible" : "opacity-0 invisible"
          } lg:hidden`}
        onClick={() => setMenuActive(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white transform transition-transform duration-300 
        ease-in-out z-50 lg:hidden overflow-y-auto ${
          menuActive ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={handleMenuToggle}
          className='absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full'
          aria-label='Close menu'
        >
          <CloseIcon className='w-6 h-6' />
        </button>
        <div className='p-4'>
          <Link href='/' className='block mb-8'>
            <img src='/assets/logo/logo.png' alt='Logo' className='h-8' />
          </Link>
          <nav className='space-y-4'>
            <Link
              href='/'
              className='block py-2 text-gray-700 hover:text-primary'
            >
              Home
            </Link>
            <Link
              href='/shop'
              className='block py-2 text-gray-700 hover:text-primary'
            >
              Shop
            </Link>
            <Link
              href='/contact'
              className='block py-2 text-gray-700 hover:text-primary'
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </div>

      {/* Top Header */}
      <div
        className={`bg-[#FFF0E5] transition-all duration-300 ${
          scroll ? "hidden" : "block"
        }`}
      >
        <div className='container mx-auto px-4'>
          <div className='flex justify-between items-center flex-wrap gap-2'>
            {/* Left Side Links */}
            <ul className='hidden md:flex items-center space-x-6'>
              <li>
                <Link
                  href='#'
                  className='text-black text-sm hover:underline py-2 block'
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-black text-sm hover:underline py-2 block'
                >
                  Free Delivery
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-black text-sm hover:underline py-2 block'
                >
                  Returns Policy
                </Link>
              </li>
            </ul>

            {/* Right Side Menu */}
            <ul className='flex items-center space-x-6'>
              {/* Help Center Dropdown */}
              <li className='relative group'>
                <Link href='#' className='text-black text-sm py-2 block'>
                  Help Center
                </Link>
                <ul
                  className='hidden group-hover:block absolute top-full left-0 bg-white shadow-lg rounded-md 
                  py-2 w-48 z-50 border border-gray-100'
                >
                  <li>
                    <Link
                      href='#'
                      className='flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100'
                    >
                      <i className='ph ph-headset mr-2' />
                      Call Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='#'
                      className='flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100'
                    >
                      <i className='ph ph-chat-circle-dots mr-2' />
                      Live Chat
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Language Selector */}
              <li className='relative group'>
                <button className='text-black text-sm py-2 flex items-center'>
                  {selectedLanguage}
                  <i className='ph ph-caret-down ml-1' />
                </button>
                <ul
                  className='hidden group-hover:block absolute top-full left-0 bg-white shadow-lg rounded-md 
                  py-2 w-48 z-50 border border-gray-100'
                >
                  <li>
                    <button
                      onClick={() => handleLanguageChange("English")}
                      className='w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100'
                    >
                      <img
                        src='assets/images/thumbs/flag1.png'
                        alt=''
                        className='w-4 h-3 mr-2'
                      />
                      English
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleLanguageChange("Japan")}
                      className='w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100'
                    >
                      <img
                        src='assets/images/thumbs/flag2.png'
                        alt=''
                        className='w-4 h-3 mr-2'
                      />
                      Japan
                    </button>
                  </li>
                </ul>
              </li>

              {/* Currency Selector */}
              <li className='relative group'>
                <button className='text-black text-sm py-2 flex items-center'>
                  {selectedCurrency}
                  <i className='ph ph-caret-down ml-1' />
                </button>
                <ul
                  className='hidden group-hover:block absolute top-full left-0 bg-white shadow-lg rounded-md 
                  py-2 w-48 z-50 border border-gray-100'
                >
                  <li>
                    <button
                      onClick={() => handleCurrencyChange("USD")}
                      className='w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100'
                    >
                      <img
                        src='assets/images/thumbs/flag1.png'
                        alt=''
                        className='w-4 h-3 mr-2'
                      />
                      USD
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div
        className={`bg-white border-b border-gray-100 transition-all duration-300
          ${
            shouldShowHeader
              ? "fixed top-0 left-0 right-0 shadow-md transform translate-y-0 animate-slideDown z-50"
              : scroll
              ? "fixed top-0 left-0 right-0 shadow-md transform -translate-y-full z-50"
              : ""
          }`}
      >
        <div className='container mx-auto px-8 md:px-4'>
          <nav className='flex items-center justify-between py-4'>
            {/* Logo */}
            <Link href='/' className='flex-shrink-0'>
              <img src='/assets/logo/logo.png' alt='Logo' className='h-16' />
            </Link>

            {/* Main Navigation */}
            <ul className='hidden lg:flex items-center space-x-8 font-normal text-[17px]'>
              <li>
                <Link
                  href='/'
                  className={`text-gray-700 hover:text-primary transition-colors
                    ${pathname === "/" ? "text-primary" : ""}`}
                >
                  Home
                </Link>
              </li>
              {/* <li>
                <Link
                  href='/collections'
                  className='text-gray-700 hover:text-primary transition-colors'
                >
                  Collections
                </Link>
              </li> */}
              <li className='relative'>
                <span className='absolute -top-5 -right-2 bg-primaryLight text-white text-xs px-2 py-1 rounded'>
                  New
                  <span className='absolute left-1/3 transform -translate-x-1/2 top-full w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-primaryLight'></span>
                </span>
                <Link
                  href='/products'
                  className={`text-gray-700 hover:text-primary transition-colors
                    ${pathname === "/products" ? "text-primary" : ""}`}
                >
                  Products
                </Link>
              </li>
              {/* <li>
                <Link
                  href='/blog'
                  className='text-gray-700 hover:text-primary transition-colors'
                >
                  Blog
                </Link>
              </li> */}
              <li>
                <Link
                  href='/contact'
                  className={`text-gray-700 hover:text-primary transition-colors
                    ${pathname === "/contact" ? "text-primary" : ""}`}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href='/ai'
                  className={`text-gray-700 hover:text-primary transition-colors flex items-center gap-1
                    ${pathname === "/ai" ? "text-primary" : ""}`}
                >
                  <Sparkles className='w-4 h-4 text-primary/60' />
                  AI Suggestion
                </Link>
              </li>
            </ul>

            {/* Right Side Icons */}
            <div className='hidden lg:flex items-center space-x-4'>
              <Link
                href='/'
                className='flex items-center gap-2 text-gray-700 hover:text-primary transition-colors'
              >
                <SearchIcon className='h-[20px]' />
              </Link>
              <Link
                href='/cart'
                className='flex items-center gap-2 text-gray-700 hover:text-primary transition-colors pr-2'
              >
                <span className='relative'>
                  <CartIcon className='h-[20px]' />
                  <span
                    className='absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center 
                    bg-primary text-white text-xs rounded-full'
                  >
                    2
                  </span>
                </span>
              </Link>
              <Link
                href='/auth/login'
                className='text-gray-700 hover:text-primary transition-colors border border-gray-300 rounded-full px-4 py-1  hover:border-primary '
              >
                <span className='transition-transform transform hover:scale-[1.02] text-center flex justify-center items-center text-[17px] pb-[1px]'>
                  Get Started
                </span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className='lg:hidden text-gray-700 hover:text-primary p-2 -mr-2'
              onClick={handleMenuToggle}
              aria-label='Toggle menu'
            >
              <MenuIcon className='w-6 h-6' />
            </button>
          </nav>
        </div>
      </div>

      {/* Animation Styles */}
      {/* <style jsx global>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-in-out forwards;
        }
      `}</style> */}
    </header>
  );
};

export default Header;
