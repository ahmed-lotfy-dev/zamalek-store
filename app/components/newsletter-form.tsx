"use client";

import { useState, useTransition } from "react";
import { subscribeToNewsletter } from "@/app/lib/actions/newsletter";
import { Button } from "@heroui/react";

import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "@/app/components/ui/toast";

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
        // If the error message is a translation key, translate it.
        // Otherwise fallback to a generic error or the raw message if needed.
        // Assuming result.message is a key like "invalidEmail" or "errorMessage"
        setErrorMessage(t(result.message));
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <Mail size={16} className="text-default-400" />
          </div>
          <input
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
            className={`w-full px-3 py-2 pl-10 rounded-medium border-2 transition-colors
              ${errorMessage
                ? "border-danger"
                : "border-default-200 hover:border-default-400 focus:border-primary"
              }
              bg-transparent
              outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              ${errorMessage ? "text-danger" : "text-foreground"}
              placeholder:text-default-400
            `}
          />
        </div>
        <Button
          size="sm"
          onPress={handleSubmit}
          isPending={isPending}
        >
          {t("subscribe")}
        </Button>
      </div>
      {errorMessage && (
        <p className="text-tiny text-danger px-1">{errorMessage}</p>
      )}
    </div>
  );
}
