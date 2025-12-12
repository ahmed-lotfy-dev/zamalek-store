"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "@/app/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen relative w-full overflow-x-hidden bg-background">
      {/* Mobile Sidebar (Sheet) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b px-4 h-16 flex items-center justify-between">
        <div className="font-bold text-lg">Admin Panel</div>
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Admin Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80">
            <SheetTitle className="sr-only">Admin Menu</SheetTitle>
            <SheetDescription className="sr-only">Admin Navigation</SheetDescription>
            <AdminSidebar isOpen={true} onClose={() => setIsMenuOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Sidebar (Desktop Only) */}
      <div className="hidden md:block w-64 shrink-0 fixed inset-y-0 z-40">
        <AdminSidebar isOpen={true} />
      </div>

      {/* Main Content */}
      <main className="flex-1 min-w-0 bg-secondary/10 p-4 pt-20 md:p-8 md:pt-8 md:pl-72 w-full min-h-screen">
        {children}
      </main>
    </div>
  );
}
