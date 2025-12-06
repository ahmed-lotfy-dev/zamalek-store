"use client";

import { useCart } from "@/app/context/cart-context";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { RadioGroup, Radio } from "@heroui/radio";
import { Select, SelectItem } from "@heroui/select";
import { Image } from "@heroui/image";
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
        <Button color="primary" onPress={() => router.push("/products")}>
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
            <CardBody className="overflow-visible py-2">
              {savedAddresses.length > 0 && (
                <div className="mb-6">
                  <Select
                    label={t("savedAddresses")}
                    placeholder={t("selectAddressPlaceholder")}
                    className="max-w-xs"
                    onChange={(e) => {
                      const address = savedAddresses.find(
                        (a) => a.id === e.target.value
                      );
                      if (address) {
                        setFormData((prev) => ({
                          ...prev,
                          address: address.street,
                          city: address.city,
                          // We might want to add zip/state/country to formData if needed
                        }));
                      }
                    }}
                  >
                    {savedAddresses.map((addr) => (
                      <SelectItem key={addr.id}>
                        {addr.street}, {addr.city}
                      </SelectItem>
                    ))}
                  </Select>
                  <Divider className="my-4" />
                </div>
              )}

              <form
                id="checkout-form"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={t("fullName")}
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    isRequired
                    variant="bordered"
                  />
                  <Input
                    label={t("email")}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    isRequired
                    variant="bordered"
                  />
                </div>
                <Input
                  label={t("phone")}
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  isRequired
                  variant="bordered"
                />
                <Input
                  label={t("address")}
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  isRequired
                  variant="bordered"
                />
                <Input
                  label={t("city")}
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  isRequired
                  variant="bordered"
                />
              </form>
            </CardBody>
          </Card>

          <Card className="p-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h2 className="text-xl font-bold">{t("paymentMethod")}</h2>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, paymentMethod: val }))
                }
              >
                <Radio value="cod" description={t("codDesc")}>
                  {t("cod")}
                </Radio>
                <Radio value="paymob" description={t("paymobDesc")}>
                  {t("paymob")}
                </Radio>
                <Radio value="paymob_wallet" description={t("walletDesc")}>
                  {t("wallet")}
                </Radio>
                <Radio
                  value="kashier"
                  description="Pay securely with Credit/Debit Card"
                >
                  {t("kashier")}
                </Radio>
                <Radio
                  value="stripe"
                  description="Pay securely with Credit Card (Stripe)"
                >
                  {t("stripe")}
                </Radio>
              </RadioGroup>

              {/* Wallet Selection Fields - Show when Paymob Wallet is selected */}
              {formData.paymentMethod === "paymob_wallet" && (
                <div className="mt-4 space-y-4 p-4 border border-primary-200 rounded-lg bg-primary-50">
                  <h3 className="text-lg font-semibold text-primary-700">
                    {t("walletDetails")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label={t("selectNetwork")}
                      placeholder="Choose wallet type"
                      selectedKeys={
                        formData.walletType ? [formData.walletType] : []
                      }
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        setFormData((prev) => ({
                          ...prev,
                          walletType: selected,
                        }));
                      }}
                      isRequired
                      variant="bordered"
                    >
                      {walletOptions.map((wallet) => (
                        <SelectItem key={wallet.value}>
                          {wallet.label}
                        </SelectItem>
                      ))}
                    </Select>
                    <Input
                      label={t("mobileNumber")}
                      placeholder="01234567890"
                      type="tel"
                      value={formData.walletNumber}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          walletNumber: e.target.value,
                        }))
                      }
                      isRequired
                      variant="bordered"
                      description={t("mobileNumberDesc")}
                    />
                  </div>
                  <p className="text-sm text-default-600">{t("walletNote")}</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-4 sticky top-24">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h2 className="text-xl font-bold">{t("orderSummary")}</h2>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <div className="space-y-4 my-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-default-100 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        classNames={{
                          wrapper: "w-full h-full",
                          img: "w-full h-full object-cover",
                        }}
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

              <Divider className="my-4" />

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

                <Divider className="my-2" />
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
                      size="sm"
                      variant="bordered"
                    />
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      isLoading={isValidatingCoupon}
                      onPress={handleApplyCoupon}
                      isDisabled={!couponCode.trim()}
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
                      size="sm"
                      color="danger"
                      variant="light"
                      onPress={handleRemoveCoupon}
                      className="min-w-0 h-8 px-2"
                    >
                      {t("remove")}
                    </Button>
                  </div>
                )}
              </div>

              <Button
                color="primary"
                size="lg"
                className="w-full mt-6 font-semibold"
                type="submit"
                form="checkout-form"
                isLoading={isLoading}
              >
                {t("placeOrder")}
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
