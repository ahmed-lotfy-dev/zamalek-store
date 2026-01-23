"use client";

import { deleteHeroSlide, toggleHeroSlideStatus } from "@/app/lib/actions/hero";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";

type HeroSlide = {
  id: string;
  title: string | null;
  titleEn: string | null;
  description: string | null;
  descriptionEn: string | null;
  imageUrl: string;
  link: string | null;
  order: number;
  isActive: boolean;
};

export default function HeroList({ slides }: { slides: HeroSlide[] }) {
  const t = useTranslations("Admin");
  const locale = useLocale();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("hero")}</h1>
        <Link href="/admin/hero/new">
          <Button>{t("addSlide")}</Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">{t("image")}</TableHead>
              <TableHead>{t("title")}</TableHead>
              <TableHead>{t("order")}</TableHead>
              <TableHead>{t("active")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slides.map((slide) => {
              const displayTitle =
                locale === "en" 
                  ? slide.titleEn || slide.title 
                  : slide.title || slide.titleEn;

              return (
                <TableRow key={slide.id}>
                  <TableCell>
                    <div className="relative w-16 h-10 rounded overflow-hidden bg-muted">
                      <Image
                        src={slide.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {displayTitle || "-"}
                  </TableCell>
                  <TableCell>{slide.order}</TableCell>
                  <TableCell>
                    <form action={toggleHeroSlideStatus.bind(null, slide.id)}>
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className={slide.isActive ? "text-green-600" : "text-gray-400"}
                      >
                         <Badge variant={slide.isActive ? "default" : "secondary"}>
                            {slide.isActive ? "Yes" : "No"}
                         </Badge>
                      </Button>
                    </form>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/hero/${slide.id}/edit`}>
                        <Button size="sm" variant="ghost">
                          {t("edit")}
                        </Button>
                      </Link>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            {t("delete")}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("deleteSlide")}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t("deleteSlideConfirm")}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                            <form action={deleteHeroSlide.bind(null, slide.id)}>
                              <AlertDialogAction type="submit" className="bg-destructive hover:bg-destructive/90">
                                {t("confirm")}
                              </AlertDialogAction>
                            </form>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {slides.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t("noSlides")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
