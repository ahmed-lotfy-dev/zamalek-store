"use client";

import { useCart } from "@/app/context/cart-context";
import { Button, Card, CardContent, CardHeader, Input, Label, Radio, RadioGroup, Select, ListBox, TextField } from "@heroui/react";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { toast } from "@/app/components/ui/toast";
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
        <Button variant="primary" onPress={() => router.push("/products")}>
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
          <Card className="p-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h2 className="text-xl font-bold">{t("shippingInfo")}</h2>
              <p className="text-small text-default-500 mt-1">
                {t("selectAddress")}
              </p>
            </CardHeader>
            <CardContent className="overflow-visible py-2">
              {savedAddresses.length > 0 && (
                <div className="mb-6">
                  <Select
                    className="max-w-xs"
                    onSelectionChange={(keys) => {
                      if (keys) {
                        const addrId = Array.from(keys as unknown as Set<string>)[0];
                        const address = savedAddresses.find((a) => a.id === addrId);
                        if (address) {
                          setFormData((prev) => ({
                            ...prev,
                            address: address.street,
                            city: address.city,
                          }));
                        }
                      }
                    }}
                  >
                    <Label>{t("savedAddresses")}</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {savedAddresses.map((addr) => (
                          <ListBox.Item key={addr.id} id={addr.id} textValue={`${addr.street}, ${addr.city}`}>
                            {addr.street}, {addr.city}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                  <hr className="my-4 border-default-200" />
                </div>
              )}

              <form
                id="checkout-form"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField isRequired>
                    <Label>{t("fullName")}</Label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </TextField>
                  <TextField isRequired>
                    <Label>{t("email")}</Label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </TextField>
                </div>
                <TextField isRequired>
                  <Label>{t("phone")}</Label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </TextField>
                <TextField isRequired>
                  <Label>{t("address")}</Label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </TextField>
                <TextField isRequired>
                  <Label>{t("city")}</Label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </TextField>
              </form>
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h2 className="text-xl font-bold">{t("paymentMethod")}</h2>
            </CardHeader>
            <CardContent className="overflow-visible py-2">
              <RadioGroup
                value={formData.paymentMethod}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, paymentMethod: val }))
                }
              >
                <div className="space-y-2">
                  <Radio value="cod">
                    <div>
                      <div className="font-medium">{t("cod")}</div>
                      <div className="text-xs text-default-500">{t("codDesc")}</div>
                    </div>
                  </Radio>
                  <Radio value="paymob">
                    <div>
                      <div className="font-medium">{t("paymob")}</div>
                      <div className="text-xs text-default-500">{t("paymobDesc")}</div>
                    </div>
                  </Radio>
                  <Radio value="paymob_wallet">
                    <div>
                      <div className="font-medium">{t("wallet")}</div>
                      <div className="text-xs text-default-500">{t("walletDesc")}</div>
                    </div>
                  </Radio>
                  <Radio value="kashier">
                    <div>
                      <div className="font-medium">{t("kashier")}</div>
                      <div className="text-xs text-default-500">Pay securely with Credit/Debit Card</div>
                    </div>
                  </Radio>
                  <Radio value="stripe">
                    <div>
                      <div className="font-medium">{t("stripe")}</div>
                      <div className="text-xs text-default-500">Pay securely with Credit Card (Stripe)</div>
                    </div>
                  </Radio>
                </div>
              </RadioGroup>

              {/* Wallet Selection Fields - Show when Paymob Wallet is selected */}
              {formData.paymentMethod === "paymob_wallet" && (
                <div className="mt-4 space-y-4 p-4 border border-primary-200 rounded-lg bg-primary-50">
                  <h3 className="text-lg font-semibold text-primary-700">
                    {t("walletDetails")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      selectedKey={formData.walletType || undefined}
                      onSelectionChange={(keys) => {
                        if (keys) {
                          const selected = Array.from(keys as unknown as Set<string>)[0];
                          setFormData((prev) => ({
                            ...prev,
                            walletType: selected,
                          }));
                        }
                      }}
                      isRequired
                      placeholder="Choose wallet type"
                      className="w-full"
                    >
                      <Label>{t("selectNetwork")} *</Label>
                      <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {walletOptions.map((wallet) => (
                            <ListBox.Item key={wallet.value} id={wallet.value} textValue={wallet.label}>
                              {wallet.label}
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                    <TextField isRequired>
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
                      <div className="text-xs text-default-500 mt-1">{t("mobileNumberDesc")}</div>
                    </TextField>
                  </div>
                  <p className="text-sm text-default-600">{t("walletNote")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-4 sticky top-24">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h2 className="text-xl font-bold">{t("orderSummary")}</h2>
            </CardHeader>
            <CardContent className="overflow-visible py-2">
              <div className="space-y-4 my-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-default-100 rounded-lg overflow-hidden shrink-0 relative">
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
                      <p className="text-default-500 text-xs">
                        {t("qty")}: {formatNumber(item.quantity)}
                      </p>
                    </div>
                    <p className="font-semibold text-sm">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <hr className="my-4 border-default-200" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-default-500">{t("subtotal")}</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-default-500">{t("shipping")}</span>
                  <span>{t("free")}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-success font-medium">
                    <span>
                      {t("discount")} ({appliedCoupon.code})
                    </span>
                    <span>-{formatCurrency(appliedCoupon.discount)}</span>
                  </div>
                )}

                <hr className="my-2 border-default-200" />
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
                      isPending={isValidatingCoupon}
                      onPress={handleApplyCoupon}
                      isDisabled={!couponCode.trim()}
                      className="shrink-0"
                    >
                      {t("apply")}
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-success-50 p-2 rounded-lg border border-success-200">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-success-700">
                        {t("couponApplied")}
                      </span>
                      <span className="text-xs text-success-600">
                        {appliedCoupon.code}
                      </span>
                    </div>
                    <Button
                      variant="danger"
                      onPress={handleRemoveCoupon}
                      className="min-w-0 h-8 px-2 text-xs"
                    >
                      {t("remove")}
                    </Button>
                  </div>
                )}
              </div>

              <Button
                variant="primary"
                className="w-full mt-6 font-semibold text-lg py-6"
                type="submit"
                form="checkout-form"
                isPending={isLoading}
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
