import { prisma } from "@/app/lib/prisma";
import HeroForm from "../../hero-form";
import { notFound } from "next/navigation";

export default async function EditHeroSlidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const slide = await prisma.heroSlide.findUnique({
    where: { id },
  });

  if (!slide) {
    notFound();
  }

  // Ensure nulls are handled (though form schema allows optional)
  const formattedSlide = {
    ...slide,
    title: slide.title ?? undefined,
    titleEn: slide.titleEn ?? undefined,
    description: slide.description ?? undefined,
    descriptionEn: slide.descriptionEn ?? undefined,
    link: slide.link ?? undefined,
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Slide</h1>
      <HeroForm initialData={formattedSlide} />
    </div>
  );
}
