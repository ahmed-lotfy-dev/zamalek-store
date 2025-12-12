"use client";

import { useCart } from "@/app/context/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { createOrder } from "@/app/lib/actions/checkout";
import { validateCoupon } from "@/app/lib/actions/coupons";
import { useTranslations } from "next-intl";
import { useFormat } from "@/app/hooks/use-format";

interface CheckoutFormProps {
  initialData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  savedAddresses?: any[];
}

export default function CheckoutForm({
  initialData,
  savedAddresses = [],
}: CheckoutFormProps) {
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const t = useTranslations("Checkout");
  const { formatCurrency, formatNumber } = useFormat();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    type: "PERCENTAGE" | "FIXED";
    value: number;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: initialData.name,
    email: initialData.email,
    phone: initialData.phone,
    address: initialData.address,
    city: initialData.city,
    paymentMethod: "cod",
    walletType: "",
    walletNumber: "",
  });

  // Wallet options for Egypt
  const walletOptions = [
    { value: "VodafoneCash", label: "Vodafone Cash" },
    { value: "EtisalatCash", label: "Etisalat Cash" },
    { value: "OrangeMoney", label: "Orange Money" },
    { value: "BankWallet", label: "Bank Wallet" },
    { value: "AmanWallet", label: "Aman Wallet" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsValidatingCoupon(true);
    try {
      const result = await validateCoupon(couponCode, cartTotal);

      if (result.error) {
        toast.error(result.error);
        setAppliedCoupon(null);
      } else if (result.success && result.discount !== undefined) {
        toast.success(
          `${t("couponApplied")}! Saved $${result.discount.toFixed(2)}`
        );
        setAppliedCoupon({
          code: result.couponCode!,
          discount: result.discount,
          type: result.type!,
          value: result.value!,
        });
      }
    } catch (error) {
      console.error("Coupon validation error:", error);
      toast.error("Failed to apply coupon");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success("Coupon removed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (items.length === 0) {
      toast.error(t("cartEmpty"));
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("paymentMethod", formData.paymentMethod);
    formDataToSend.append("items", JSON.stringify(items));
    if (appliedCoupon) {
      formDataToSend.append("couponCode", appliedCoupon.code);
    }

    // Add wallet data if wallet payment is selected
    if (formData.paymentMethod === "paymob_wallet") {
      if (!formData.walletType || !formData.walletNumber) {
        toast.error("Please select a wallet type and enter your mobile number");
        setIsLoading(false);
        return;
      }
      formDataToSend.append("walletType", formData.walletType);
      formDataToSend.append("walletNumber", formData.walletNumber);
    }

    try {
      const result = await createOrder(null, formDataToSend);

      if (result.error) {
        toast.error(result.error);
        if (result.details) {
          console.error("Validation details:", result.details);
        }
      } else if (result.success) {
        if (result.url) {
          // Redirect to payment gateway (Paymob, Kashier, or Stripe)
          window.location.href = result.url;
        } else {
          // COD or other non-redirect methods
          toast.success("Order placed successfully!");
          clearCart();
          router.push("/checkout/success");
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">{t("cartEmpty")}</h1>
        <Button onClick={() => router.push("/products")}>
          {t("continueShopping")}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Shipping & Payment */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("shippingInfo")}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {t("selectAddress")}
              </p>
            </CardHeader>
            <CardContent>
              {savedAddresses.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-col gap-2 max-w-xs">
                    <Label>{t("savedAddresses")}</Label>
                    <Select
                      onValueChange={(val) => {
                        const address = savedAddresses.find((a) => a.id === val);
                        if (address) {
                          setFormData((prev) => ({
                            ...prev,
                            address: address.street,
                            city: address.city,
                          }));
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an address" />
                      </SelectTrigger>
                      <SelectContent>
                        {savedAddresses.map((addr) => (
                          <SelectItem key={addr.id} value={addr.id}>
                            {addr.street}, {addr.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator className="my-4" />
                </div>
              )}

              <form
                id="checkout-form"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>{t("fullName")}</Label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>{t("email")}</Label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>{t("phone")}</Label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>{t("address")}</Label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>{t("city")}</Label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("paymentMethod")}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, paymentMethod: val }))
                }
                className="space-y-4"
              >
                <div className="flex items-start space-x-3 space-y-0">
                  <RadioGroupItem value="cod" id="cod" className="mt-1" />
                  <div className="grid gap-0.5 leading-none">
                    <Label htmlFor="cod" className="font-medium cursor-pointer">{t("cod")}</Label>
                    <p className="text-sm text-muted-foreground">{t("codDesc")}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 space-y-0">
                  <RadioGroupItem value="paymob" id="paymob" className="mt-1" />
                  <div className="grid gap-0.5 leading-none">
                    <Label htmlFor="paymob" className="font-medium cursor-pointer">{t("paymob")}</Label>
                    <p className="text-sm text-muted-foreground">{t("paymobDesc")}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 space-y-0">
                  <RadioGroupItem value="paymob_wallet" id="paymob_wallet" className="mt-1" />
                  <div className="grid gap-0.5 leading-none">
                    <Label htmlFor="paymob_wallet" className="font-medium cursor-pointer">{t("wallet")}</Label>
                    <p className="text-sm text-muted-foreground">{t("walletDesc")}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 space-y-0">
                  <RadioGroupItem value="kashier" id="kashier" className="mt-1" />
                  <div className="grid gap-0.5 leading-none">
                    <Label htmlFor="kashier" className="font-medium cursor-pointer">{t("kashier")}</Label>
                    <p className="text-sm text-muted-foreground">Pay securely with Credit/Debit Card</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 space-y-0">
                  <RadioGroupItem value="stripe" id="stripe" className="mt-1" />
                  <div className="grid gap-0.5 leading-none">
                    <Label htmlFor="stripe" className="font-medium cursor-pointer">{t("stripe")}</Label>
                    <p className="text-sm text-muted-foreground">Pay securely with Credit Card (Stripe)</p>
                  </div>
                </div>
              </RadioGroup>

              {/* Wallet Selection Fields - Show when Paymob Wallet is selected */}
              {formData.paymentMethod === "paymob_wallet" && (
                <div className="mt-6 space-y-4 p-4 border rounded-lg bg-muted/50">
                  <h3 className="text-lg font-semibold">
                    {t("walletDetails")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label>{t("selectNetwork")} *</Label>
                      <Select
                        value={formData.walletType || ""}
                        onValueChange={(val) =>
                          setFormData((prev) => ({
                            ...prev,
                            walletType: val,
                          }))
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose wallet type" />
                        </SelectTrigger>
                        <SelectContent>
                          {walletOptions.map((wallet) => (
                            <SelectItem key={wallet.value} value={wallet.value}>
                              {wallet.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>{t("mobileNumber")}</Label>
                      <Input
                        placeholder="01234567890"
                        type="tel"
                        value={formData.walletNumber}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            walletNumber: e.target.value,
                          }))
                        }
                      />
                      <div className="text-xs text-muted-foreground">{t("mobileNumberDesc")}</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{t("walletNote")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>{t("orderSummary")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden shrink-0 relative border">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {t("qty")}: {formatNumber(item.quantity)}
                      </p>
                    </div>
                    <p className="font-semibold text-sm">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("subtotal")}</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("shipping")}</span>
                  <span>{t("free")}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>
                      {t("discount")} ({appliedCoupon.code})
                    </span>
                    <span>-{formatCurrency(appliedCoupon.discount)}</span>
                  </div>
                )}

                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>{t("total")}</span>
                  <span>
                    {formatCurrency(cartTotal - (appliedCoupon?.discount || 0))}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder={t("couponCode")}
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="secondary"
                      disabled={!couponCode.trim() || isValidatingCoupon}
                      onClick={handleApplyCoupon}
                      className="shrink-0"
                    >
                      {t("apply")}
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-green-50 p-2 rounded-lg border border-green-200">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-green-700">
                        {t("couponApplied")}
                      </span>
                      <span className="text-xs text-green-600">
                        {appliedCoupon.code}
                      </span>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={handleRemoveCoupon}
                      className="h-8 px-2 text-xs"
                      size="sm"
                    >
                      {t("remove")}
                    </Button>
                  </div>
                )}
              </div>

              <Button
                className="w-full mt-6 font-semibold text-lg py-6"
                type="submit"
                form="checkout-form"
                disabled={isLoading}
              >
                {t("placeOrder")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
