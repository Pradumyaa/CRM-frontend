// pages/components/Footer.jsx
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-3 px-6">
      <div className="flex flex-col sm:flex-row justify-between items-center text-gray-500 text-sm">
        <div className="mb-2 sm:mb-0">
          &copy; {currentYear} Dashboard. All rights reserved.
        </div>
        <div className="flex space-x-6">
          <a
            href="#"
            className="hover:text-indigo-600 transition-colors duration-200"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="hover:text-indigo-600 transition-colors duration-200"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="hover:text-indigo-600 transition-colors duration-200"
          >
            Contact Support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
