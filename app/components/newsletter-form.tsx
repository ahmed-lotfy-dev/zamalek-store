"use client";

import { useState, useTransition } from "react";
import { subscribeToNewsletter } from "@/app/lib/actions/newsletter";
import { addToast } from "@heroui/toast";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";

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
        addToast({
          title: t("successTitle"),
          description: t(result.message),
          color: "success",
        });
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
        <Input
          placeholder={t("emailPlaceholder")}
          startContent={<Mail size={16} className="text-default-400" />}
          size="sm"
          variant="bordered"
          value={email}
          onValueChange={(val) => {
            setEmail(val);
            if (errorMessage) setErrorMessage("");
          }}
          isDisabled={isPending}
          isInvalid={!!errorMessage}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          classNames={{
            inputWrapper: errorMessage ? "border-danger" : "",
          }}
        />
        <Button
          color="primary"
          size="sm"
          onPress={handleSubmit}
          isLoading={isPending}
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
