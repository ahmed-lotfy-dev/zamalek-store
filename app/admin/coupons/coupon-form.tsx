"use client";

import { createCoupon, updateCoupon } from "@/app/lib/actions/coupons";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { RadioGroup, Radio } from "@heroui/radio";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/app/components/ui/toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Coupon = {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  amount: number;
  maxUses: number | null;
  expiresAt: Date | null;
};

export default function CouponForm({ coupon }: { coupon?: Coupon }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: coupon?.code || "",
    type: (coupon?.type || "PERCENTAGE") as "PERCENTAGE" | "FIXED",
    amount: coupon?.amount.toString() || "",
    maxUses: coupon?.maxUses?.toString() || "",
    expiresAt: coupon?.expiresAt
      ? new Date(coupon.expiresAt).toISOString().split("T")[0]
      : "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = {
        code: formData.code.toUpperCase(),
        type: formData.type,
        amount: Number(formData.amount),
        maxUses: formData.maxUses ? Number(formData.maxUses) : undefined,
        expiresAt: formData.expiresAt
          ? new Date(formData.expiresAt)
          : undefined,
      };

      const result = coupon
        ? await updateCoupon(coupon.id, data)
        : await createCoupon(data);

      if (result?.success) {
        toast.success(
          coupon ? "Coupon updated successfully" : "Coupon created successfully"
        );
        router.push("/admin/coupons");
        router.refresh();
      } else if (result?.error) {
        toast.error(result.error || "Failed to save coupon");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          as={Link}
          href="/admin/coupons"
          variant="light"
          isIconOnly
          radius="full"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold">
          {coupon ? "Edit Coupon" : "Create New Coupon"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Coupon Details</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Coupon Code"
              placeholder="e.g. SUMMER2024"
              name="code"
              value={formData.code}
              onChange={handleChange}
              isRequired
              variant="bordered"
              description="Codes are case-insensitive and unique."
            />

            <RadioGroup
              label="Discount Type"
              value={formData.type}
              onValueChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  type: val as "PERCENTAGE" | "FIXED",
                }))
              }
              orientation="horizontal"
            >
              <Radio value="PERCENTAGE">Percentage (%)</Radio>
              <Radio value="FIXED">Fixed Amount ($)</Radio>
            </RadioGroup>

            <Input
              label={
                formData.type === "PERCENTAGE"
                  ? "Percentage Off"
                  : "Discount Amount"
              }
              placeholder={formData.type === "PERCENTAGE" ? "10" : "50.00"}
              name="amount"
              type="number"
              max={formData.type === "PERCENTAGE" ? 20 : undefined}
              value={formData.amount}
              onChange={handleChange}
              isRequired
              variant="bordered"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">
                    {formData.type === "PERCENTAGE" ? "%" : "$"}
                  </span>
                </div>
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Max Uses (Optional)"
                placeholder="Unlimited"
                name="maxUses"
                type="number"
                min={0}
                value={formData.maxUses}
                onChange={handleChange}
                variant="bordered"
                description="Leave empty for unlimited usage."
              />

              <Input
                label="Expiration Date (Optional)"
                name="expiresAt"
                type="date"
                value={formData.expiresAt}
                onChange={handleChange}
                variant="bordered"
                placeholder=" "
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                as={Link}
                href="/admin/coupons"
                variant="flat"
                color="default"
              >
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={isLoading}>
                {coupon ? "Update Coupon" : "Create Coupon"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
