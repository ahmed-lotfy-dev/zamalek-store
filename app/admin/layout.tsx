"use client";

import { Button } from "@heroui/button";
import { usePathname } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import AdminSidebar from "@/app/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, setIsPending] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: session } = await authClient.getSession();
      if (!session) {
        router.push("/sign-in");
      }
      setIsPending(false);
    };
    checkAuth();
  }, [router]);

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen relative w-full max-w-[100vw] overflow-x-hidden bg-background">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-content1 border-b border-divider flex items-center px-4 z-40 justify-between">
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            variant="light"
            onPress={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={24} />
          </Button>
          <span className="font-bold text-large">Admin Panel</span>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 min-w-0 bg-background p-4 pt-20 md:p-8 md:pt-8 w-full">
        {children}
      </main>
    </div>
  );
}
