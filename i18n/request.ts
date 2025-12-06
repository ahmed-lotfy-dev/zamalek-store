import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import fs from "fs";
import path from "path";

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const messagesDir = path.resolve(process.cwd(), "messages", locale as string);
  const messages: Record<string, any> = {};

  if (fs.existsSync(messagesDir)) {
    const files = fs.readdirSync(messagesDir);
    for (const file of files) {
      if (file.endsWith(".json")) {
        const namespace = path.basename(file, ".json");
        const content = JSON.parse(
          fs.readFileSync(path.join(messagesDir, file), "utf-8")
        );
        messages[namespace] = content;
      }
    }
  }

  return {
    locale: locale as string,
    messages,
  };
});
