import {
  getUserAddresses,
  createAddress,
  deleteAddress,
} from "@/app/lib/actions/addresses";
import { Button, Card, CardContent, CardHeader, Input } from "@heroui/react";

import { Plus, Trash2, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function AddressesPage() {
  const addresses = await getUserAddresses();
  const t = await getTranslations("Profile");

  async function handleAddAddress(formData: FormData) {
    "use server";
    const data = {
      street: formData.get("street") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zip: formData.get("zip") as string,
      country: formData.get("country") as string,
    };
    await createAddress(data);
  }

  async function handleDeleteAddress(id: string) {
    "use server";
    await deleteAddress(id);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
          <h2 className="text-xl font-bold">{t("addressBook")}</h2>
          <p className="text-small text-default-500">{t("addressBookDesc")}</p>
        </CardHeader>
        <CardContent className="overflow-visible py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add New Address Form */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{t("addNewAddress")}</h3>
              <form action={handleAddAddress} className="space-y-4">
                <Input
                  name="street"
                  label={t("streetAddress")}
                  placeholder="123 Main St"
                  isRequired
                  variant="bordered"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="city"
                    label={t("city")}
                    placeholder="Cairo"
                    isRequired
                    variant="bordered"
                  />
                  <Input
                    name="state"
                    label={t("state")}
                    placeholder="Cairo"
                    isRequired
                    variant="bordered"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="zip"
                    label={t("zip")}
                    placeholder="11511"
                    isRequired
                    variant="bordered"
                  />
                  <Input
                    name="country"
                    label={t("country")}
                    defaultValue="Egypt"
                    isRequired
                    variant="bordered"
                  />
                </div>
                <Button
                  type="submit"
                  color="primary"
                  startContent={<Plus size={18} />}
                >
                  {t("saveAddress")}
                </Button>
              </form>
            </div>

            {/* Saved Addresses List */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{t("savedAddresses")}</h3>
              {addresses.length === 0 ? (
                <div className="text-center py-8 text-default-500 border border-dashed border-divider rounded-lg">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>{t("noAddresses")}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="p-4 border border-divider rounded-lg flex justify-between items-start group hover:border-primary transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{address.street}</p>
                        <p className="text-sm text-default-500">
                          {address.city}, {address.state} {address.zip}
                        </p>
                        <p className="text-sm text-default-500">
                          {address.country}
                        </p>
                      </div>
                      <form action={handleDeleteAddress.bind(null, address.id)}>
                        <Button
                          isIconOnly
                          size="sm"
                          color="danger"
                          variant="light"
                          type="submit"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
