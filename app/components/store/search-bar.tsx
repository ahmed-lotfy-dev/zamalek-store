"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Search, X, Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { searchProducts } from "@/app/lib/actions/products";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useFormat } from "@/app/hooks/use-format";
import { cn } from "@/app/lib/utils"

type SearchResult = {
  id: string;
  name: string;
  slug: string;
  price: any;
  images: string[];
  category: { name: string; nameEn?: string | null };
};

export default function SearchBar({
  initialQuery = "",
  onSearch,
}: {
  initialQuery?: string;
  onSearch?: (query: string) => void;
}) {
  const t = useTranslations("Product");
  const locale = useLocale();
  const { formatCurrency } = useFormat();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync with initialQuery if it changes externally
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Debounce Search for Dropdown
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
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(query);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-md" ref={containerRef}>
      <div className="relative relative w-full sm:w-[20rem]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9 pr-8"
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            if (val.length < 2) setIsOpen(false);
          }}
          onKeyDown={handleKeyDown}
        />
        {query.length > 0 && (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              if (onSearch) onSearch("");
            }}
            className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:bg-transparent"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>

      {isOpen && (results.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 p-1 bg-popover text-popover-foreground rounded-md shadow-md z-50 border">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ul className="max-h-[300px] overflow-y-auto py-1">
              {results.map((product) => (
                <li
                  key={product.slug}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  onClick={() => handleSelect(product.slug)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 bg-secondary">
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
                      <span className="font-medium line-clamp-1">
                        {product.name}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>
                          {locale === "en"
                            ? product.category.nameEn || product.category.name
                            : product.category.name}
                        </span>
                        <span>•</span>
                        <span className="text-primary font-semibold">
                          {formatCurrency(Number(product.price))}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
