"use client";

import { deleteCategory } from "@/app/lib/actions/categories";
import { Button } from "@heroui/button"

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
        <Button as={Link} href="/admin/categories/new" color="primary">
          {t("addCategory")}
        </Button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="p-4 font-medium">{t("name")}</th>
              <th className="p-4 font-medium text-right">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {categories.map((category) => {
              const displayName =
                locale === "en"
                  ? category.nameEn || category.name
                  : category.name;

              return (
                <tr
                  key={category.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="p-4">{displayName}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        as={Link}
                        href={`/admin/categories/${category.id}/edit`}
                        size="sm"
                        variant="light"
                      >
                        {t("edit")}
                      </Button>
                      <form action={deleteCategory.bind(null, category.id)}>
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
            {categories.length === 0 && (
              <tr>
                <td colSpan={2} className="p-8 text-center text-zinc-500">
                  {t("noCategories")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
