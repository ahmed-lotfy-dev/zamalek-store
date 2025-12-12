"use client";

import { useState, useTransition } from "react";
import { subscribeToNewsletter } from "@/app/lib/actions/newsletter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function NewsletterForm() {
  const t = useTranslations("Footer");
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = () => {
    setErrorMessage("");
    if (!email) {
      setErrorMessage(t("emailRequired"));
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", email);

      const result = await subscribeToNewsletter(formData);

      if (result.success) {
        toast.success(t(result.message));
        setEmail("");
      } else {
        setErrorMessage(t(result.message));
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <Mail size={16} className="text-muted-foreground" />
          </div>
          <Input
            type="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMessage) setErrorMessage("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            disabled={isPending}
            className={`pl-10 ${errorMessage ? "border-destructive focus-visible:ring-destructive" : ""}`}
            autoComplete="email"
          />
        </div>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {t("subscribe")}
        </Button>
      </div>
      {errorMessage && (
        <p className="text-xs text-destructive px-1">{errorMessage}</p>
      )}
    </div>
  );
}
