"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SearchBox = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const keyword = searchParams?.get("q");
  const [searchTerm, setSearchTerm] = useState(keyword || "");

  // Handle input changes
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search input submission or change
  const handleSearch = (text) => {
    const params = new URLSearchParams(searchParams);
    params.set("q", text);
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Handle clear button click
  const clearSearch = () => {
    setSearchTerm(""); // Reset input field
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Handle enter key press for search submission
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(searchTerm);
    }
  };

  useEffect(() => {
    // If the URL search params change directly (not through input)
    if (keyword !== searchTerm) {
      setSearchTerm(keyword || "");
    }
  }, [keyword]);

  return (
    <div className="flex items-center bg-background border border-gray-300 p-2 px-3 rounded-full gap-4 w-80">
      <Search className="text-gray-200" />
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} // Trigger search on "Enter"
        placeholder="Search here..."
        className="text-sm w-full outline-none"
      />
      {searchTerm && (
        <button onClick={clearSearch}>
          <X size={17} className="text-gray-600 text-xs" />
        </button>
      )}
    </div>
  );
};

export default SearchBox;
