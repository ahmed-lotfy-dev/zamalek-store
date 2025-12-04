import { getSavedItems } from "@/app/lib/actions/saved-items";
import SavedItemsList from "@/app/components/store/saved-items-list";

export const dynamic = "force-dynamic";

export default async function SavedItemsPage() {
  const savedItems = await getSavedItems();

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Saved Items
            </h1>
            <p className="text-default-500">{savedItems.length} items saved</p>
          </div>

          <SavedItemsList savedItems={savedItems} />
        </div>
      </main>
    </div>
  );
}
