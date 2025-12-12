import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  if (locale === "ar") {
    return {
      locale,
      messages: {
        Admin: (await import("@/messages/ar/Admin.json")).default,
        Auth: (await import("@/messages/ar/Auth.json")).default,
        Cart: (await import("@/messages/ar/Cart.json")).default,
        Categories: (await import("@/messages/ar/Categories.json")).default,
        Checkout: (await import("@/messages/ar/Checkout.json")).default,
        Coupons: (await import("@/messages/ar/Coupons.json")).default,
        Footer: (await import("@/messages/ar/Footer.json")).default,
        HomePage: (await import("@/messages/ar/HomePage.json")).default,
        Language: (await import("@/messages/ar/Language.json")).default,
        Navigation: (await import("@/messages/ar/Navigation.json")).default,
        Product: (await import("@/messages/ar/Product.json")).default,
        Profile: (await import("@/messages/ar/Profile.json")).default,
        Reviews: (await import("@/messages/ar/Reviews.json")).default,
        Theme: (await import("@/messages/ar/Theme.json")).default,
      },
    };
  } else {
    return {
      locale,
      messages: {
        Admin: (await import("@/messages/en/Admin.json")).default,
        Auth: (await import("@/messages/en/Auth.json")).default,
        Cart: (await import("@/messages/en/Cart.json")).default,
        Categories: (await import("@/messages/en/Categories.json")).default,
        Checkout: (await import("@/messages/en/Checkout.json")).default,
        Coupons: (await import("@/messages/en/Coupons.json")).default,
        Footer: (await import("@/messages/en/Footer.json")).default,
        HomePage: (await import("@/messages/en/HomePage.json")).default,
        Language: (await import("@/messages/en/Language.json")).default,
        Navigation: (await import("@/messages/en/Navigation.json")).default,
        Product: (await import("@/messages/en/Product.json")).default,
        Profile: (await import("@/messages/en/Profile.json")).default,
        Reviews: (await import("@/messages/en/Reviews.json")).default,
        Theme: (await import("@/messages/en/Theme.json")).default,
      },
    };
  }
});
