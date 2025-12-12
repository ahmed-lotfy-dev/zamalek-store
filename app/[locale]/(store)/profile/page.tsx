import { getUserProfile } from "@/app/lib/actions/profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function ProfilePage() {
  const user = await getUserProfile();
  const t = await getTranslations("Profile");

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("info")}</CardTitle>
          <CardDescription>{t("infoDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border">
                <Image
                  src={user.image || "https://placehold.co/96x96?text=User"}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="flex flex-col gap-2">
                <Label>{t("fullName")}</Label>
                <Input value={user.name} readOnly className="bg-muted" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>{t("email")}</Label>
                <Input value={user.email} readOnly className="bg-muted" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>{t("role")}</Label>
                <Input value={user.role} readOnly className="bg-muted" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>{t("memberSince")}</Label>
                <Input
                  value={new Date(user.createdAt).toLocaleDateString()}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
