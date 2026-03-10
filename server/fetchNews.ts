"use server";

import Parser from "rss-parser";
import { unstable_cache } from "next/cache";
import { ArticleType, NewsData } from "@/app/page";

async function _fetchFeed(url: string) {
  try {
    const parser = new Parser({
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/123.0.0.0 Safari/537.36",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
    });

    const feed = await parser.parseURL(url);

    const cleanItems: ArticleType[] = feed.items.map((item) => ({
      title: item.title || "-", // Fallback if missing
      pubDate: item.pubDate || "",
      isoDate: item.isoDate || "",
      link: item.link || "",
      guid: item.guid || item.link || "", // Use link as ID if guid is missing
      content: item.content || "",
      contentSnippet: item.contentSnippet || "",
    }));

    return { items: cleanItems };
  } catch (error) {
    console.error("Error while trying to fetch the feed", error);
    throw new Error("Failed to fetch feed.");
  }
}

export const fetchNews = unstable_cache(_fetchFeed, ["newsFeed"], {
  revalidate: 900,
});
