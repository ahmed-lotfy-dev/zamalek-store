"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Pagination } from "@heroui/react";

interface PaginationControlProps {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  paramName?: string;
}

export default function PaginationControl({
  totalCount,
  pageSize,
  currentPage,
  paramName = "page",
}: PaginationControlProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(totalCount / pageSize);

  const onPageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(paramName, page.toString());
      router.push(`?${params.toString()}`);
    },
    [router, searchParams, paramName]
  );

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-4">
      <Pagination
        total={totalPages}
        page={currentPage}
        onChange={onPageChange}
        showControls
        color="primary"
        variant="light"
      />
    </div>
  );
}
