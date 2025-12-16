import React, { useState, useEffect, useRef } from "react";

export const useSearch = (initialValue = "", delay = 500) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm, delay, debouncedSearchTerm]);

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setIsSearching(false);
  };

  return {
    searchTerm,
    debouncedSearchTerm,
    isSearching,
    setSearchTerm,
    clearSearch,
  };
};

export function SearchBox({
  onSearch,
  placeholder = "Search...",
  className = "",
  delay = 500,
  disabled = false,
  ...props
}) {
  const {
    searchTerm,
    debouncedSearchTerm,
    isSearching,
    setSearchTerm,
    clearSearch,
  } = useSearch("", delay);

  const prevSearchTermRef = useRef();

  useEffect(() => {
    if (prevSearchTermRef.current !== debouncedSearchTerm) {
      prevSearchTermRef.current = debouncedSearchTerm;
      onSearch?.(debouncedSearchTerm, isSearching);
    }
  }, [debouncedSearchTerm, isSearching]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    clearSearch();
  };

  const getIcon = () => {
    const iconClass = "size-4 text-gray-400";

    switch (props.icon) {
      case "filter":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
            />
          </svg>
        );
      case "find":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        );
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        disabled={disabled}
        className={`form-control px-10 w-full sm:w-64 ${className}`}
        {...props}
      />

      <div className="absolute left-3 top-2/4 -translate-y-2/4 size-5 flex items-center pointer-events-none">
        {isSearching ? (
          <svg
            className="size-5 text-black-500 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          getIcon()
        )}
      </div>

      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
          type="button"
          disabled={disabled}
        >
          <svg
            className="size-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export default SearchBox;
