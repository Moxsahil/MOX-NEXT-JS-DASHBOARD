"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TableSearch = ({ placeholder = "Search records..." }: { placeholder?: string }) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSearching(true);

    const value = (e.currentTarget[0] as HTMLInputElement).value;

    const params = new URLSearchParams(window.location.search);
    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    
    router.push(`${window.location.pathname}?${params}`);
    
    // Reset searching state after a short delay
    setTimeout(() => setIsSearching(false), 500);
  };

  const clearSearch = () => {
    setSearchValue("");
    const params = new URLSearchParams(window.location.search);
    params.delete("search");
    router.push(`${window.location.pathname}?${params}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full md:w-auto"
    >
      <div className="flex items-center bg-dark-secondary/80 backdrop-blur-lg rounded-2xl border border-dark-border-primary shadow-2xl px-4 py-3 hover:shadow-glow transition-all duration-300 group focus-within:shadow-glow focus-within:border-brand-primary">
        <div className="text-dark-text-secondary group-focus-within:text-brand-primary transition-colors duration-200 mr-3">
          {isSearching ? (
            <div className="w-4 h-4 border-2 border-dark-border-secondary border-t-brand-primary rounded-full animate-spin"></div>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
        
        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-[280px] bg-transparent outline-none text-dark-text-primary placeholder-dark-text-disabled font-medium"
        />
        
        {searchValue && (
          <button
            type="button"
            onClick={clearSearch}
            className="ml-2 w-5 h-5 rounded-full bg-dark-elevated hover:bg-dark-elevated/80 flex items-center justify-center text-dark-text-secondary hover:text-dark-text-primary transition-colors duration-200"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        <div className="ml-3 hidden sm:flex items-center gap-1 text-xs text-dark-text-disabled bg-dark-elevated px-2 py-1 rounded-lg font-medium">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span>Enter</span>
        </div>
      </div>
    </form>
  );
};

export default TableSearch;
