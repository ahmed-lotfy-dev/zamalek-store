"use client";

import { useState, useEffect, useRef } from "react";
import { Input, Listbox, ListboxItem, Spinner } from "@heroui/react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { searchProducts } from "@/app/lib/actions/products";
import Image from "next/image";

type SearchResult = {
  id: string;
  name: string;
  slug: string;
  price: any;
  images: string[];
  category: { name: string };
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        const products = await searchProducts(query);
        setResults(products as SearchResult[]);
        setIsLoading(false);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (slug: string) => {
    router.push(`/products/${slug}`);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div className="relative w-full max-w-md" ref={containerRef}>
      <Input
        classNames={{
          base: "w-full sm:w-[20rem] h-10",
          mainWrapper: "h-full",
          input: "text-small",
          inputWrapper:
            "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
        }}
        placeholder="Search products..."
        size="sm"
        startContent={<Search size={18} />}
        value={query}
        onValueChange={(val) => {
          setQuery(val);
          if (val.length < 2) setIsOpen(false);
        }}
        isClearable
        onClear={() => {
          setQuery("");
          setIsOpen(false);
        }}
      />

      {isOpen && (results.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-content1 rounded-large shadow-lg z-50 border border-default-100">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Spinner size="sm" />
            </div>
          ) : (
            <Listbox
              aria-label="Search Results"
              onAction={(key) => handleSelect(key as string)}
              classNames={{
                base: "max-h-[300px] overflow-y-auto",
              }}
            >
              {results.map((product) => (
                <ListboxItem key={product.slug} textValue={product.name}>
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-default-200">
                      <Image
                        src={
                          product.images[0] ||
                          "https://placehold.co/100x100?text=No+Image"
                        }
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-small font-medium text-default-900 line-clamp-1">
                        {product.name}
                      </span>
                      <div className="flex items-center gap-2 text-tiny text-default-500">
                        <span>{product.category.name}</span>
                        <span>•</span>
                        <span className="text-primary font-semibold">
                          ${Number(product.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </ListboxItem>
              ))}
            </Listbox>
          )}
        </div>
      )}
    </div>
  );
}
