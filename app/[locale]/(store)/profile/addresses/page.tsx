import {
  getUserAddresses,
  createAddress,
  deleteAddress,
} from "@/app/lib/actions/addresses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        <CardHeader>
          <CardTitle>{t("addressBook")}</CardTitle>
          <CardDescription>{t("addressBookDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Add New Address Form */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{t("addNewAddress")}</h3>
              <form action={handleAddAddress} className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label>{t("streetAddress")}</Label>
                  <Input
                    name="street"
                    placeholder="123 Main St"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>{t("city")}</Label>
                    <Input
                      name="city"
                      placeholder="Cairo"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>{t("state")}</Label>
                    <Input
                      name="state"
                      placeholder="Cairo"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>{t("zip")}</Label>
                    <Input
                      name="zip"
                      placeholder="11511"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>{t("country")}</Label>
                    <Input
                      name="country"
                      defaultValue="Egypt"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t("saveAddress")}
                </Button>
              </form>
            </div>

            {/* Saved Addresses List */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{t("savedAddresses")}</h3>
              {addresses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>{t("noAddresses")}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="p-4 border rounded-lg flex justify-between items-start group hover:border-primary transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{address.street}</p>
                        <p className="text-sm text-muted-foreground">
                          {address.city}, {address.state} {address.zip}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {address.country}
                        </p>
                      </div>
                      <form action={handleDeleteAddress.bind(null, address.id)}>
                        <Button
                          size="icon"
                          variant="ghost"
                          type="submit"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
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
