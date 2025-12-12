"use client";

import { createCoupon, updateCoupon } from "@/app/lib/actions/coupons";
import { Button, Card, CardContent, CardHeader, Input, Label, Radio, RadioGroup, TextField } from "@heroui/react";

import { useRouter } from "@/i18n/routing";
import { useState } from "react";
import { toast } from "@/app/components/ui/toast";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Coupons");
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
        toast.success(coupon ? t("successUpdate") : t("successCreate"));
        router.push("/admin/coupons");
        router.refresh();
      } else if (result?.error) {
        toast.error(result.error || t("errorSave"));
      }
    } catch (error) {
      toast.error(t("errorGeneric"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/coupons">
          <Button
            variant="ghost"
            isIconOnly
            className="rounded-full"
          >
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">
          {coupon ? t("editTitle") : t("createTitle")}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">{t("details")}</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <TextField isRequired>
              <Label>{t("code")}</Label>
              <Input
                placeholder={t("codePlaceholder")}
                name="code"
                value={formData.code}
                onChange={handleChange}
              />
              <div className="text-xs text-default-500 mt-1">{t("codeDesc")}</div>
            </TextField>

            <div>
              <Label>{t("type")}</Label>
              <RadioGroup
                value={formData.type}
                onChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: val as "PERCENTAGE" | "FIXED",
                  }))
                }
                orientation="horizontal"
                className="mt-2"
              >
                <Radio value="PERCENTAGE">{t("percentage")}</Radio>
                <Radio value="FIXED">{t("fixed")}</Radio>
              </RadioGroup>
            </div>

            <TextField isRequired>
              <Label>
                {formData.type === "PERCENTAGE"
                  ? t("percentageOff")
                  : t("discountAmount")}
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center z-10">
                  <span className="text-default-400 text-small">
                    {formData.type === "PERCENTAGE" ? "%" : "$"}
                  </span>
                </div>
                <Input
                  placeholder={formData.type === "PERCENTAGE" ? "10" : "50.00"}
                  name="amount"
                  type="number"
                  max={formData.type === "PERCENTAGE" ? 20 : undefined}
                  value={formData.amount}
                  onChange={handleChange}
                  className="pl-8"
                />
              </div>
            </TextField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField>
                <Label>{t("maxUses")}</Label>
                <Input
                  placeholder={t("maxUsesPlaceholder")}
                  name="maxUses"
                  type="number"
                  min={0}
                  value={formData.maxUses}
                  onChange={handleChange}
                />
                <div className="text-xs text-default-500 mt-1">{t("maxUsesDesc")}</div>
              </TextField>

              <TextField>
                <Label>{t("expiresAt")}</Label>
                <Input
                  name="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={handleChange}
                  placeholder=" "
                />
              </TextField>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Link href="/admin/coupons">
                <Button variant="ghost">
                  {t("cancel")}
                </Button>
              </Link>
              <Button variant="primary" type="submit" isPending={isLoading}>
                {coupon ? t("update") : t("create")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
