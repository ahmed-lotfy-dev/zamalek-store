"use client";

import { User, Package, MapPin } from "lucide-react";
import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/app/lib/utils"

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    { name: "Profile", href: "/profile", icon: User },
    { name: "Orders", href: "/profile/orders", icon: Package },
    { name: "Addresses", href: "/profile/addresses", icon: MapPin },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-2">
              <nav className="flex flex-col gap-1">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        buttonVariants({ variant: isActive ? "default" : "ghost" }),
                        "justify-start gap-3 w-full"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  );
}
