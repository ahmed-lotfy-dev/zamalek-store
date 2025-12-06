import { getCoupons } from "@/app/lib/actions/coupons";
import { CreateCouponButton } from "./create-button";
import { CouponsTable } from "./coupons-table";

export default async function AdminCouponsPage() {
  const { coupons, error } = await getCoupons();

  if (error || !coupons) {
    return <div>Failed to load coupons</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <CreateCouponButton />
      </div>

      <CouponsTable coupons={coupons} />
    </div>
  );
}
