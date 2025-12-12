"use client";

import { deleteProduct } from "@/app/lib/actions/products";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
        <Link href="/admin/products/new">
          <Button>
            {t("addProduct")}
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("price")}</TableHead>
              <TableHead>{t("stock")}</TableHead>
              <TableHead>{t("category")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const displayName =
                locale === "en" ? product.nameEn || product.name : product.name;
              const displayCategory =
                locale === "en"
                  ? product.category?.nameEn || product.category?.name
                  : product.category?.name;

              return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{displayName}</TableCell>
                  <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    {displayCategory || t("uncategorized")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button
                          size="sm"
                          variant="ghost"
                        >
                          {t("edit")}
                        </Button>
                      </Link>
                      <form action={deleteProduct.bind(null, product.id)}>
                        <Button
                          type="submit"
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          {t("delete")}
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t("noProducts")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
