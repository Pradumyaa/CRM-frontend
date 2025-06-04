
// components/workspace/enhanced/SearchWithResults.jsx
import { useState, useEffect, useRef } from "react";
import { Search, X, Folder, List, CheckSquare, Users } from "lucide-react";
import useSpacesStore from "@/store/useSpacesStore";

const SearchWithResults = ({ onSelectResult }) => {
  const { searchWorkspace } = useSpacesStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl+K or Cmd+K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      
      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery("");
        setResults(null);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    if (query.trim().length >= 2) {
      const searchResults = searchWorkspace(query);
      setResults(searchResults);
      setActiveIndex(-1);
    } else {
      setResults(null);
    }
  }, [query, searchWorkspace]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleResultClick = (result, type) => {
    if (onSelectResult) {
      onSelectResult(result, type);
    }
    setIsOpen(false);
    setQuery("");
    setResults(null);
  };

  const getAllResults = () => {
    if (!results) return [];
    
    const allResults = [];
    
    results.spaces.forEach(item => allResults.push({ ...item, type: 'space' }));
    results.folders.forEach(item => allResults.push({ ...item, type: 'folder' }));
    results.projectLists.forEach(item => allResults.push({ ...item, type: 'projectList' }));
    results.tasks.forEach(item => allResults.push({ ...item, type: 'task' }));
    
    return allResults;
  };

  const handleKeyDown = (e) => {
    if (!isOpen || !results) return;

    const allResults = getAllResults();

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => Math.min(prev + 1, allResults.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && allResults[activeIndex]) {
          const result = allResults[activeIndex];
          handleResultClick(result, result.type);
        }
        break;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'space':
        return <div className="w-4 h-4 rounded-full bg-indigo-500" />;
      case 'folder':
        return <Folder size={16} className="text-yellow-500" />;
      case 'projectList':
        return <List size={16} className="text-blue-500" />;
      case 'task':
        return <CheckSquare size={16} className="text-green-500" />;
      default:
        return <Search size={16} className="text-gray-500" />;
    }
  };

  const getResultTitle = (result, type) => {
    switch (type) {
      case 'space':
        return result.name;
      case 'folder':
        return `${result.name} • ${result.spaceName}`;
      case 'projectList':
        return `${result.name} • ${result.folderName}`;
      case 'task':
        return `${result.name} • ${result.projectListName}`;
      default:
        return result.name;
    }
  };

  const getResultSubtitle = (result, type) => {
    switch (type) {
      case 'space':
        return `${result.folders?.length || 0} folders`;
      case 'folder':
        return `${result.projectLists?.length || 0} project lists`;
      case 'projectList':
        return `${result.tasks?.length || 0} tasks`;
      case 'task':
        return result.description || 'No description';
      default:
        return '';
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder="Search everything... (⌘K)"
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults(null);
              setIsOpen(false);
            }}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && (query.length >= 2 || results) && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          {!results && query.length >= 2 && (
            <div className="px-4 py-8 text-center text-gray-500">
              <Search size={24} className="mx-auto mb-2 opacity-50" />
              <p>Start typing to search...</p>
            </div>
          )}

          {results && (
            <>
              {results.spaces.length === 0 && 
               results.folders.length === 0 && 
               results.projectLists.length === 0 && 
               results.tasks.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  <Search size={24} className="mx-auto mb-2 opacity-50" />
                  <p>No results found for "{query}"</p>
                </div>
              ) : (
                <div className="py-2">
                  {results.spaces.length > 0 && (
                    <div>
                      <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase border-b border-gray-100">
                        Spaces ({results.spaces.length})
                      </div>
                      {results.spaces.map((space, index) => (
                        <button
                          key={`space-${space.id}`}
                          onClick={() => handleResultClick(space, 'space')}
                          className={`w-full px-4 py-3 flex items-center hover:bg-gray-50 text-left ${
                            activeIndex === index ? 'bg-indigo-50' : ''
                          }`}
                        >
                          <div className="flex-shrink-0 mr-3">
                            {getIcon('space')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">
                              {getResultTitle(space, 'space')}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {getResultSubtitle(space, 'space')}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {results.tasks.length > 0 && (
                    <div>
                      <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase border-b border-gray-100">
                        Tasks ({results.tasks.length})
                      </div>
                      {results.tasks.slice(0, 5).map((task, index) => (
                        <button
                          key={`task-${task.id}`}
                          onClick={() => handleResultClick(task, 'task')}
                          className={`w-full px-4 py-3 flex items-center hover:bg-gray-50 text-left ${
                            activeIndex === results.spaces.length + index ? 'bg-indigo-50' : ''
                          }`}
                        >
                          <div className="flex-shrink-0 mr-3">
                            {getIcon('task')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">
                              {task.name}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {task.projectListName} • {task.folderName}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchWithResults;