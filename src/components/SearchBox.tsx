"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import Image from "next/image";
import { createPortal } from "react-dom";

interface SearchResult {
  id: string | number;
  title: string;
  subtitle: string;
  type: string;
  url: string;
  avatar?: string;
}

const SearchBox = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const debouncedQuery = useDebounce(query, 300);

  // Create portal element
  useEffect(() => {
    let modalRoot = document.getElementById('search-dropdown-root');
    if (!modalRoot) {
      modalRoot = document.createElement('div');
      modalRoot.id = 'search-dropdown-root';
      modalRoot.style.position = 'fixed';
      modalRoot.style.top = '0';
      modalRoot.style.left = '0';
      modalRoot.style.width = '100%';
      modalRoot.style.height = '100%';
      modalRoot.style.zIndex = '99999';
      modalRoot.style.pointerEvents = 'none';
      document.body.appendChild(modalRoot);
    }
    setPortalElement(modalRoot);
  }, []);

  // Calculate dropdown position
  const updateDropdownPosition = () => {
    if (searchRef.current) {
      const rect = searchRef.current.getBoundingClientRect();
      const maxHeight = window.innerHeight - rect.bottom - 16; // Leave some margin
      
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  // Update position when dropdown opens
  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      const handleResize = () => updateDropdownPosition();
      const handleScroll = () => updateDropdownPosition();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isOpen]);

  // Search function
  const performSearch = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.results) {
        setResults(data.results);
        setIsOpen(true);
        setSelectedIndex(-1);
        // Reset scroll position when new results come in
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
      }
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle debounced search
  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  // Scroll selected item into view
  const scrollIntoView = (index: number) => {
    if (scrollContainerRef.current && index >= 0) {
      const container = scrollContainerRef.current;
      const items = container.querySelectorAll('button');
      const selectedItem = items[index];
      
      if (selectedItem) {
        const containerRect = container.getBoundingClientRect();
        const itemRect = selectedItem.getBoundingClientRect();
        
        const isAbove = itemRect.top < containerRect.top;
        const isBelow = itemRect.bottom > containerRect.bottom;
        
        if (isAbove) {
          container.scrollTop = selectedItem.offsetTop;
        } else if (isBelow) {
          container.scrollTop = selectedItem.offsetTop + selectedItem.offsetHeight - container.clientHeight;
        }
      }
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        const nextIndex = selectedIndex < results.length - 1 ? selectedIndex + 1 : 0;
        setSelectedIndex(nextIndex);
        scrollIntoView(nextIndex);
        break;
      case "ArrowUp":
        e.preventDefault();
        const prevIndex = selectedIndex > 0 ? selectedIndex - 1 : results.length - 1;
        setSelectedIndex(prevIndex);
        scrollIntoView(prevIndex);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle result selection
  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
    setQuery("");
    setIsOpen(false);
    inputRef.current?.blur();
  };

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const searchContainer = searchRef.current;
      const dropdownContainer = document.getElementById('search-dropdown-root');
      
      if (searchContainer && !searchContainer.contains(target) &&
          dropdownContainer && !dropdownContainer.contains(target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyboardShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyboardShortcut);
    return () => document.removeEventListener("keydown", handleKeyboardShortcut);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "student":
        return (
          <div className="w-8 h-8 bg-gradient-to-r from-accent-cyan to-accent-teal rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      case "teacher":
        return (
          <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
        );
      case "class":
        return (
          <div className="w-8 h-8 bg-gradient-to-r from-accent-purple to-accent-pink rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        );
      case "subject":
        return (
          <div className="w-8 h-8 bg-gradient-to-r from-accent-emerald to-accent-lime rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        );
      case "event":
        return (
          <div className="w-8 h-8 bg-gradient-to-r from-accent-amber to-accent-orange rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case "announcement":
        return (
          <div className="w-8 h-8 bg-gradient-to-r from-accent-rose to-accent-red rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
        );
      case "parent":
        return (
          <div className="w-8 h-8 bg-gradient-to-r from-accent-indigo to-accent-blue rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        );
      case "lesson":
        return (
          <div className="w-8 h-8 bg-gradient-to-r from-accent-violet to-accent-purple rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        );
      case "exam":
        return (
          <div className="w-8 h-8 bg-gradient-to-r from-accent-orange to-accent-yellow rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div ref={searchRef} className="relative z-10">
      <div className="hidden md:flex items-center gap-3 bg-dark-tertiary/80 backdrop-blur-xl rounded-2xl border border-dark-border-secondary shadow-2xl px-5 py-3 hover:shadow-glow transition-all duration-300 group hover:bg-dark-tertiary">
        <div className="text-dark-text-tertiary group-focus-within:text-brand-primary transition-colors duration-200">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-dark-border-secondary border-t-brand-primary rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search students, teachers, classes..."
          className="w-[280px] bg-transparent outline-none text-dark-text-primary placeholder-dark-text-tertiary font-medium"
        />
        <div className="text-xs text-dark-text-tertiary bg-dark-elevated px-3 py-1.5 rounded-lg font-semibold border border-dark-border-secondary">
          ⌘K
        </div>
      </div>

      {/* Search Results Dropdown - Rendered in Portal */}
      {isOpen && (results.length > 0 || query.length >= 2) && portalElement && createPortal(
        <div 
          className="search-dropdown bg-dark-secondary/95 backdrop-blur-xl rounded-2xl border border-dark-border-primary shadow-2xl overflow-hidden"
          style={{
            position: 'fixed',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            zIndex: 100000,
            pointerEvents: 'auto'
          }}
        >
          {results.length > 0 ? (
            <>
              <div className="px-4 py-2 border-b border-dark-border-secondary flex items-center justify-between">
                <span className="text-xs font-semibold text-dark-text-secondary uppercase tracking-wider">
                  Search Results ({results.length})
                </span>
                {results.length > 4 && (
                  <span className="text-xs text-dark-text-tertiary flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
                    </svg>
                    Scroll for more
                  </span>
                )}
              </div>
              <div 
                ref={scrollContainerRef}
                className="max-h-80 overflow-y-auto scroll-smooth search-results-scroll relative"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#52525b #27272a'
                }}
              >
                {results.map((result, index) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-elevated/50 transition-colors duration-200 text-left ${
                      index === selectedIndex ? "bg-dark-elevated/50" : ""
                    }`}
                  >
                    {result.avatar ? (
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                        <Image
                          src={result.avatar}
                          alt={result.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      getTypeIcon(result.type)
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-dark-text-primary truncate">
                        {result.title}
                      </div>
                      <div className="text-xs text-dark-text-secondary truncate">
                        {result.subtitle}
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-dark-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
                {results.length > 4 && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-dark-secondary/95 to-transparent pointer-events-none"></div>
                )}
              </div>
            </>
          ) : query.length >= 2 && !isLoading ? (
            <div className="px-4 py-6 text-center">
              <div className="w-12 h-12 bg-dark-elevated rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-dark-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-dark-text-primary font-semibold">No results found</p>
              <p className="text-xs text-dark-text-secondary mt-1">
                Try searching with different keywords
              </p>
            </div>
          ) : null}
        </div>,
        portalElement
      )}
    </div>
  );
};

export default SearchBox;