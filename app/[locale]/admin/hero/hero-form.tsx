"use client";

import { createHeroSlide, updateHeroSlide } from "@/app/lib/actions/hero";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ImageUpload from "@/app/components/admin/image-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "@/i18n/routing";

const formSchema = z.object({
  title: z.string().optional(),
  titleEn: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  imageUrl: z.string().min(1, { message: "Image is required" }),
  link: z.string().optional(),
  isActive: z.boolean(),
});

type HeroFormValues = z.infer<typeof formSchema>;

interface HeroFormProps {
  initialData?: HeroFormValues & { id: string };
}

export default function HeroForm({ initialData }: HeroFormProps) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<HeroFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      titleEn: "",
      description: "",
      descriptionEn: "",
      imageUrl: "",
      link: "",
      isActive: true,
    },
  });

  const onSubmit = async (data: HeroFormValues) => {
    try {
      setLoading(true);
      const formData = new FormData();
      if (data.title) formData.append("title", data.title);
      if (data.titleEn) formData.append("titleEn", data.titleEn);
      if (data.description) formData.append("description", data.description);
      if (data.descriptionEn) formData.append("descriptionEn", data.descriptionEn);
      formData.append("imageUrl", data.imageUrl);
      if (data.link) formData.append("link", data.link);
      formData.append("isActive", String(data.isActive));

      if (initialData) {
        await updateHeroSlide(initialData.id, formData);
      } else {
        await createHeroSlide(formData);
      }
      
      // The action handles redirect, but we can also use router.push if needed.
      // Since the action calls redirect(), this code might not be reached or needed.
      // But typically we rely on server action redirect.
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("title")} (Arabic)</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="عنوان الشريحة" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="titleEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("title")} (English)</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Slide Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Arabic)</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="الوصف" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descriptionEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (English)</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link (Optional)</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="/products/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">{t("active")}</FormLabel>
                    <FormDescription>
                      Show this slide on the home page.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-8">
             <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("image")}</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={(url) => field.onChange(url)}
                      folder="hero-slides"
                      label="Hero Image"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button disabled={loading} type="submit" className="ml-auto">
          {initialData ? "Save Changes" : "Create Slide"}
        </Button>
      </form>
    </Form>
  );
}
