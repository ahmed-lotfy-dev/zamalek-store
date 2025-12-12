"use client";

import { deleteCategory } from "@/app/lib/actions/categories";
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

type Category = {
  id: string;
  name: string;
  nameEn?: string | null;
};

export default function CategoryList({
  categories,
}: {
  categories: Category[];
}) {
  const t = useTranslations("Admin");
  const locale = useLocale();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("categories")}</h1>
        <Link href="/admin/categories/new">
          <Button>
            {t("addCategory")}
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("name")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => {
              const displayName =
                locale === "en"
                  ? category.nameEn || category.name
                  : category.name;

              return (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{displayName}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/categories/${category.id}/edit`}>
                        <Button
                          size="sm"
                          variant="ghost"
                        >
                          {t("edit")}
                        </Button>
                      </Link>
                      <form action={deleteCategory.bind(null, category.id)}>
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
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  {t("noCategories")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
