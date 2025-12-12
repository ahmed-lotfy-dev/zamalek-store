"use client";

import { deleteProduct } from "@/app/lib/actions/products";
import { Button } from "@heroui/react";

import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";

type Product = {
  id: string;
  name: string;
  nameEn?: string | null;
  price: any; // Decimal type handling
  stock: number;
  category: { name: string; nameEn?: string | null } | null;
};

export default function ProductList({ products }: { products: Product[] }) {
  const t = useTranslations("Admin");
  const locale = useLocale();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("products")}</h1>
        <Button as={Link} href="/admin/products/new" color="primary">
          {t("addProduct")}
        </Button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="p-4 font-medium">{t("name")}</th>
              <th className="p-4 font-medium">{t("price")}</th>
              <th className="p-4 font-medium">{t("stock")}</th>
              <th className="p-4 font-medium">{t("category")}</th>
              <th className="p-4 font-medium text-right">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {products.map((product) => {
              const displayName =
                locale === "en" ? product.nameEn || product.name : product.name;
              const displayCategory =
                locale === "en"
                  ? product.category?.nameEn || product.category?.name
                  : product.category?.name;

              return (
                <tr
                  key={product.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="p-4">{displayName}</td>
                  <td className="p-4">${Number(product.price).toFixed(2)}</td>
                  <td className="p-4">{product.stock}</td>
                  <td className="p-4">
                    {displayCategory || t("uncategorized")}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        as={Link}
                        href={`/admin/products/${product.id}/edit`}
                        size="sm"
                        variant="light"
                      >
                        {t("edit")}
                      </Button>
                      <form action={deleteProduct.bind(null, product.id)}>
                        <Button
                          type="submit"
                          size="sm"
                          color="danger"
                          variant="light"
                        >
                          {t("delete")}
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-500">
                  {t("noProducts")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
