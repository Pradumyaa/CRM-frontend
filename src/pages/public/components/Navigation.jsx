// components/public/Navigation.jsx - Updated
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navigation = ({ currentPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Support", path: "/support" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-lg shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#5932EA] to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="text-2xl font-bold text-[#5932EA]">
              GetMax BET
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-medium transition-colors ${
                  currentPage === item.path
                    ? "text-[#5932EA]"
                    : "text-gray-700 hover:text-[#5932EA]"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/login"
              className="px-4 py-2 text-[#5932EA] border border-[#5932EA] rounded-lg hover:bg-[#5932EA] hover:text-white transition-all"
            >
              Login
            </Link>
            <Link
              to="/crm"
              className="px-6 py-2 bg-[#5932EA] text-white rounded-lg hover:bg-[#4526B5] transition-all shadow-lg hover:shadow-xl"
            >
              Try BET Tool
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t py-4">
            <div className="flex flex-col space-y-4 px-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`font-medium ${
                    currentPage === item.path
                      ? "text-[#5932EA]"
                      : "text-gray-700 hover:text-[#5932EA]"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/login"
                className="px-4 py-2 text-[#5932EA] border border-[#5932EA] rounded-lg text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/crm"
                className="px-6 py-2 bg-[#5932EA] text-white rounded-lg text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Try BET Tool
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;