import { getAllHeroSlides } from "@/app/lib/actions/hero";
import HeroList from "./hero-list";

export default async function AdminHeroPage() {
  const slides = await getAllHeroSlides();

  return (
    <div className="flex flex-col gap-4">
      <HeroList slides={slides} />
    </div>
  );
}
