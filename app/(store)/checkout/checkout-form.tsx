"use client";

import { useCart } from "@/app/context/cart-context";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { RadioGroup, Radio } from "@heroui/radio";
import { Image } from "@heroui/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/app/components/ui/toast";
import { createOrder } from "@/app/lib/actions/checkout";
import { validateCoupon } from "@/app/lib/actions/coupons";

interface CheckoutFormProps {
  initialData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
}

export default function CheckoutForm({ initialData }: CheckoutFormProps) {
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();
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
  });

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
        toast.success(`Coupon applied! Saved $${result.discount.toFixed(2)}`);
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
      toast.error("Your cart is empty");
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

    try {
      const result = await createOrder(null, formDataToSend);

      if (result.error) {
        toast.error(result.error);
        if (result.details) {
          console.error("Validation details:", result.details);
        }
      } else if (result.success) {
        toast.success("Order placed successfully!");
        clearCart();
        router.push("/checkout/success");
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
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Button color="primary" onPress={() => router.push("/products")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Shipping & Payment */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h2 className="text-xl font-bold">Shipping Information</h2>
              <p className="text-small text-default-500 mt-1">
                Please review your details below. If any information is missing
                (like phone or address), please add it now.
              </p>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <form
                id="checkout-form"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    isRequired
                    variant="bordered"
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    isRequired
                    variant="bordered"
                  />
                </div>
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  isRequired
                  variant="bordered"
                />
                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  isRequired
                  variant="bordered"
                />
                <Input
                  label="City"
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
              <h2 className="text-xl font-bold">Payment Method</h2>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, paymentMethod: val }))
                }
              >
                <Radio value="cod" description="Pay with cash upon delivery">
                  Cash on Delivery
                </Radio>
                <Radio
                  value="paymob"
                  description="Credit Card / Wallet (Coming Soon)"
                  isDisabled
                >
                  Paymob (Online Payment)
                </Radio>
              </RadioGroup>
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-4 sticky top-24">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h2 className="text-xl font-bold">Order Summary</h2>
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
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <Divider className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-default-500">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-default-500">Shipping</span>
                  <span>Free</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-success font-medium">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-${appliedCoupon.discount.toFixed(2)}</span>
                  </div>
                )}

                <Divider className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    ${(cartTotal - (appliedCoupon?.discount || 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Coupon code"
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
                      Apply
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-success-50 p-2 rounded-lg border border-success-200">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-success-700">
                        Coupon Applied
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
                      Remove
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
                Place Order
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
