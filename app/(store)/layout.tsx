import StoreNavbar from "@/app/components/store-navbar";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />
      {children}
    </div>
  );
}
