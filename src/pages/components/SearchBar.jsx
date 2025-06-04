import { Search, History, X, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

const SearchBar = ({ setFilteredEmployees, setSearchQuery, employees }) => {
  const [query, setQuery] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedOption, setFocusedOption] = useState(-1);
  const searchRef = useRef(null);
  const historyRef = useRef(null);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const storedHistory = localStorage.getItem("employeeSearchHistory");
    if (storedHistory) {
      try {
        setSearchHistory(JSON.parse(storedHistory).slice(0, 5));
      } catch (err) {
        console.error("History parse error:", err);
      }
    }
  }, []);

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "employeeSearchHistory",
      JSON.stringify(searchHistory)
    );
  }, [searchHistory]);

  // Close history dropdown when clicking outside of it
  useEffect(() => {
    const onClickOutside = (e) => {
      if (
        !searchRef.current?.contains(e.target) &&
        !historyRef.current?.contains(e.target)
      ) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showHistory) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedOption((prev) =>
          Math.min(prev + 1, searchHistory.length - 1)
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedOption((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && focusedOption >= 0) {
        e.preventDefault();
        selectFromHistory(searchHistory[focusedOption]);
      } else if (e.key === "Escape") {
        setShowHistory(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showHistory, searchHistory, focusedOption]);

  const fetchEmployees = async () => {
    if (!query.trim()) {
      setFilteredEmployees(employees);
      setSearchQuery("");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/employees/search",
        { name: query },
        { headers: { "Content-Type": "application/json" } }
      );
      setFilteredEmployees(res.data);
      setSearchQuery(query);

      // Add search to history if not already there
      if (!searchHistory.includes(query.trim())) {
        setSearchHistory((prev) => [query.trim(), ...prev.slice(0, 4)]);
      }
    } catch (err) {
      console.error("Search failed, using fallback:", err);
      const filtered = employees.filter(
        (emp) =>
          emp.name?.toLowerCase().includes(query.toLowerCase()) ||
          emp.email?.toLowerCase().includes(query.toLowerCase()) ||
          emp.department?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredEmployees(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  // This is the function that toggles the history dropdown
  const toggleHistory = (e) => {
    e.preventDefault(); // Prevent any default behavior
    e.stopPropagation(); // Stop event from propagating
    setShowHistory((prev) => !prev); // Toggle the state
    setFocusedOption(-1); // Reset focused option when toggling
  };

  const selectFromHistory = (term) => {
    setQuery(term);
    setShowHistory(false);
    // Optionally trigger search immediately when selecting from history
    setTimeout(() => {
      const lowerQuery = term.toLowerCase();
      const filtered = employees.filter(
        (emp) =>
          emp.name?.toLowerCase().includes(lowerQuery) ||
          emp.email?.toLowerCase().includes(lowerQuery) ||
          emp.department?.toLowerCase().includes(lowerQuery)
      );
      setFilteredEmployees(filtered);
      setSearchQuery(term);
    }, 0);
  };

  const removeFromHistory = (e, index) => {
    e.stopPropagation();
    setSearchHistory((prev) => prev.filter((_, i) => i !== index));
  };

  // Clear the search input
  const clearSearch = () => {
    setQuery("");
    setFilteredEmployees(employees);
    setSearchQuery("");
  };

  return (
    <div className="relative w-full max-w-lg" ref={searchRef}>
      <div className="relative shadow-md rounded-xl overflow-hidden">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchEmployees()}
          placeholder="Search employees..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all duration-200"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-3">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
          ) : (
            <button
              className="text-gray-500 hover:text-indigo-700 transition-colors"
              title="Search"
              onClick={fetchEmployees}
            >
              <Search className="h-5 w-5" />
            </button>
          )}

          <button
            className="text-gray-500 hover:text-indigo-700 transition-colors"
            title="Search History"
            onClick={toggleHistory}
          >
            <History className="h-5 w-5" />
          </button>
        </div>

        {query && (
          <button
            onClick={clearSearch}
            title="Clear"
            className="absolute right-20 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* The history dropdown */}
      {showHistory && (
        <div
          ref={historyRef}
          className="absolute mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-[1000] overflow-visible"
        >
          <div className="px-4 py-2 text-xs text-gray-500 font-semibold uppercase border-b">
            Recent Searches
          </div>
          <div className="py-2">
            {searchHistory.length > 0 ? (
              searchHistory.map((term, index) => (
                <div
                  key={index}
                  onClick={() => selectFromHistory(term)}
                  className={`px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-indigo-50 ${
                    focusedOption === index ? "bg-indigo-100" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <Search className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-800">{term}</span>
                  </div>

                  <button
                    onClick={(e) => removeFromHistory(e, index)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                No recent searches
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
