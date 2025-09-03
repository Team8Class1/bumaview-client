"use client";

import { useState, useEffect, useCallback } from "react";

interface SearchSuggestion {
  id: string;
  title: string;
  type: "question" | "company" | "tag";
}

export function useSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const mockSuggestions: SearchSuggestion[] = [
    { id: "1", title: "React useEffect", type: "question" },
    { id: "2", title: "Next.js App Router", type: "question" },
    { id: "3", title: "TypeScript Generic", type: "question" },
    { id: "4", title: "카카오", type: "company" },
    { id: "5", title: "네이버", type: "company" },
    { id: "6", title: "React", type: "tag" },
    { id: "7", title: "JavaScript", type: "tag" },
    { id: "8", title: "TypeScript", type: "tag" },
  ];

  const searchSuggestions = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const filtered = mockSuggestions.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSuggestions(filtered);
      setIsOpen(filtered.length > 0);
      setIsLoading(false);
    },
    []
  );

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchSuggestions(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, searchSuggestions]);

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, []);

  const selectSuggestion = useCallback((suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    setIsOpen(false);
    
    // Navigate based on suggestion type
    const basePaths = {
      question: "/questions",
      company: "/companies",
      tag: "/tags"
    };
    
    const path = `${basePaths[suggestion.type]}/${suggestion.id}`;
    window.location.href = path;
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
  }, []);

  return {
    query,
    suggestions,
    isLoading,
    isOpen,
    handleSearch,
    selectSuggestion,
    clearSearch,
    setIsOpen
  };
}