import type { Metadata } from "next";
import Gallery from "@/components/Gallery";

async function getSeo() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/gallery`, {
    next: { revalidate: 3600 }, // cache for 1 hour
  });

  const result = await res.json();
  return result.data;
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo();

  return {
    title: seo.meta_title,
    description: seo.meta_desc,
    keywords: seo.meta_key,
  };
}

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-[#dfd6cc]">
      <Gallery />
    </main>
  );
}
