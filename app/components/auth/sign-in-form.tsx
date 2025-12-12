"use client";

import { useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Using sonner as Shadcn usually installs it or use-toast
import { useTranslations } from "next-intl";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export default function SignInForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("Auth");

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (values: z.infer<typeof signInSchema>) => {
    setLoading(true);
    try {
      await authClient.signIn.email({
        email: values.email,
        password: values.password,
        fetchOptions: {
          onSuccess: () => {
            router.push("/admin");
            toast.success(t("signInSuccess") || "Signed in successfully");
          },
          onError: (ctx: any) => {
            const message = ctx.error.message || t("signInError");
            toast.error(message);
            setLoading(false);
          },
        },
      });
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error(t("signInConnectionError"));
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{t("signInTitle")}</CardTitle>
        <CardDescription>{t("signInSubtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("emailPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("password")}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t("passwordPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  {t("signingIn") || "Signing in..."}
                </span>
              ) : (
                t("signInButton")
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <div className="text-center text-sm">
          {t("noAccount")}{" "}
          <Link
            href="/sign-up"
            className="font-medium underline hover:text-primary"
          >
            {t("signUpButton")}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
