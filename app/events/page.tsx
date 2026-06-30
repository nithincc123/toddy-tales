import type { Metadata } from "next";
import EventsClient from "./EventsClient";

async function getSeo() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/events`, {
    next: { revalidate: 3600 }, // IMPORTANT: avoid spam logs
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

export default function Page() {
  return <EventsClient />;
}

