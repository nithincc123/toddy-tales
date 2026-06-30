import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

async function getSeo() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/home`, {
    method: "GET",
    // ✅ IMPORTANT: prevents repeated network spam in dev + improves performance
    next: { revalidate: 3600 }, // cache for 1 hour
  });

  if (!res.ok) {
    throw new Error("Failed to fetch SEO data");
  }

  const result = await res.json();
  return result.data;
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo();

  return {
    title: seo.meta_title,
    description: seo.meta_desc,
    keywords: seo.meta_key,

    // Optional but recommended
    openGraph: {
      title: seo.meta_title,
      description: seo.meta_desc,
      type: "website",
    },

    twitter: {
      title: seo.meta_title,
      description: seo.meta_desc,
    },
  };
}

export default function Page() {
  return <HomeClient />;
}
