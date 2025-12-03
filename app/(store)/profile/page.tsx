import { getUserProfile } from "@/app/lib/actions/profile";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getUserProfile();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
          <h2 className="text-xl font-bold">Profile Information</h2>
          <p className="text-small text-default-500">
            Update your personal details.
          </p>
        </CardHeader>
        <CardBody className="overflow-visible py-4">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex flex-col items-center gap-2">
              <Avatar
                src={user.image || undefined}
                name={user.name}
                className="w-24 h-24 text-large"
              />
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <Input
                label="Full Name"
                value={user.name}
                isReadOnly
                variant="bordered"
              />
              <Input
                label="Email"
                value={user.email}
                isReadOnly
                variant="bordered"
              />
              <Input
                label="Role"
                value={user.role}
                isReadOnly
                variant="bordered"
              />
              <Input
                label="Member Since"
                value={new Date(user.createdAt).toLocaleDateString()}
                isReadOnly
                variant="bordered"
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
