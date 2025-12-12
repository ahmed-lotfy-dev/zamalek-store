"use client";

import { useCart } from "@/app/context/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription
} from "@/components/ui/sheet";
import Image from "next/image";

import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useFormat } from "@/app/hooks/use-format";
import { useLocale } from "next-intl";

export default function CartDrawer() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
  } = useCart();
  const t = useTranslations("Cart");
  const { formatCurrency, formatNumber } = useFormat();
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent side={isRtl ? "left" : "right"} className="w-full sm:max-w-md flex flex-col p-0 h-full">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <SheetTitle>
              {t("title")} ({formatNumber(items.length)})
            </SheetTitle>
          </div>
          <SheetDescription className="sr-only">
            Shopping Cart content
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-muted-foreground space-y-4">
              <ShoppingBag className="w-16 h-16 opacity-20" />
              <p>{t("empty")}</p>
              <Button
                variant="link"
                className="text-primary"
                onClick={() => setIsCartOpen(false)}
              >
                {t("startShopping")}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="w-full shadow-sm overflow-hidden">
                  <CardContent className="flex flex-row gap-4 p-3">
                    <div className="relative w-20 h-20 shrink-0 bg-secondary rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium line-clamp-2 text-sm leading-tight">
                          {item.name}
                        </h3>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-destructive hover:text-destructive/90 -mr-2 -mt-2"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="w-3 h-3" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                        <p className="font-semibold text-primary">
                          {formatCurrency(item.price)}
                        </p>
                        <div className="flex items-center gap-2 bg-secondary rounded-md p-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="w-3 h-3" />
                            <span className="sr-only">Decrease</span>
                          </Button>
                          <span className="text-xs font-medium w-4 text-center">
                            {formatNumber(item.quantity)}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="w-3 h-3" />
                            <span className="sr-only">Increase</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        {items.length > 0 && (
          <SheetFooter className="p-4 border-t bg-background mt-auto">
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t("subtotal")}</span>
                <span className="text-xl font-bold">
                  {formatCurrency(cartTotal)}
                </span>
              </div>
              <Link href="/checkout" onClick={() => setIsCartOpen(false)} className="w-full block">
                <Button
                  size="lg"
                  className="w-full font-semibold"
                >
                  {t("checkout")}
                  <ShoppingBag className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
