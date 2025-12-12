"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { useCallback } from "react";
import { Pagination } from "@heroui/react";

interface StorePaginationProps {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  paramName?: string;
}

export default function StorePagination({
  totalCount,
  pageSize,
  currentPage,
  paramName = "page",
}: StorePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(totalCount / pageSize);

  const onPageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(paramName, page.toString());

      // Scroll to top of product list
      const productList = document.getElementById("product-listing");
      if (productList) {
        productList.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      router.push(`?${params.toString()}`);
    },
    [router, searchParams, paramName]
  );

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-8">
      <Pagination
        total={totalPages}
        page={currentPage}
        onChange={onPageChange}
        showControls
        color="primary"
        variant="flat"
        size="lg"
        classNames={{
          wrapper: "gap-2",
          item: "w-10 h-10 text-small bg-default-100",
          cursor: "w-10 h-10 font-bold",
        }}
      />
    </div>
  );
}
