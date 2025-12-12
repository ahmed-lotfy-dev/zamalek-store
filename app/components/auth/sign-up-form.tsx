"use client";

import { useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { Button, Card, CardContent, CardFooter, CardHeader, Input, Label, TextField } from "@heroui/react";

import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("Auth");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authClient.signUp.email({
        email,
        password,
        name,
        fetchOptions: {
          onSuccess: () => {
            router.push("/admin");
          },
          onError: (ctx: any) => {
            alert(ctx.error.message);
            setLoading(false);
          },
        },
      });
    } catch (error) {
      console.error("Sign up error:", error);
      alert(t("signUpConnectionError"));
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col gap-1 items-center justify-center pb-0">
        <h1 className="text-2xl font-bold">{t("signUpTitle")}</h1>
        <p className="text-small text-default-500">{t("signUpSubtitle")}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <TextField isRequired>
            <Label>{t("name")}</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
            />
          </TextField>

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
            {t("signUpButton")}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center pt-0">
        <div className="text-center text-small">
          {t("hasAccount")}{" "}
          <Link
            href="/sign-in"
            className="font-medium underline hover:text-primary"
          >
            {t("signInButton")}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
