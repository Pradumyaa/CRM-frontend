import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    // Calculate range of page numbers to display
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // First page and ellipsis
    if (startPage > 1) {
      pages.push(
        <button
          key="1"
          onClick={() => onPageChange(1)}
          className="h-10 w-10 rounded-full flex items-center justify-center text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
        >
          1
        </button>
      );

      if (startPage > 2) {
        pages.push(
          <span
            key="ellipsis1"
            className="h-10 w-10 flex items-center justify-center text-gray-400"
          >
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
            currentPage === i
              ? "bg-indigo-600 text-white shadow-md"
              : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page and ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span
            key="ellipsis2"
            className="h-10 w-10 flex items-center justify-center text-gray-400"
          >
            ...
          </span>
        );
      }

      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="h-10 w-10 rounded-full flex items-center justify-center text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center py-4 bg-white border-t border-gray-200">
      <div className="flex items-center space-x-1">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`h-10 px-4 rounded-full flex items-center justify-center transition-colors ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
          }`}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Prev</span>
        </button>

        {/* Page numbers */}
        <div className="hidden sm:flex items-center space-x-1 mx-2">
          {renderPageNumbers()}
        </div>

        {/* Current page indicator for mobile */}
        <div className="sm:hidden flex items-center px-4">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`h-10 px-4 rounded-full flex items-center justify-center transition-colors ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
          }`}
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
