"use client";

import { useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { Button, Card, CardContent, CardFooter, CardHeader, Input, Label, TextField } from "@heroui/react";

import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import { toast } from "@/app/components/ui/toast";
import { useTranslations } from "next-intl";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("Auth");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authClient.signIn.email({
        email,
        password,
        fetchOptions: {
          onSuccess: () => {
            router.push("/admin");
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
      <CardHeader className="flex flex-col gap-1 items-center justify-center pb-0">
        <h1 className="text-2xl font-bold">{t("signInTitle")}</h1>
        <p className="text-small text-default-500">{t("signInSubtitle")}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          <TextField isRequired>
            <Label>{t("email")}</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
            />
          </TextField>

          <TextField isRequired>
            <Label>{t("password")}</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordPlaceholder")}
            />
          </TextField>

          <Button
            type="submit"
            isPending={loading}
            className="w-full font-medium mt-2"
          >
            {t("signInButton")}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center pt-0">
        <div className="text-center text-small">
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
