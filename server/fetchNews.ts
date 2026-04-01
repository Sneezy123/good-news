"use server";

import Parser from "rss-parser";
import { unstable_cache } from "next/cache";
import { ArticleType } from "@/app/page";

import rateHeadlines from "./rateHeadlines";

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

    // Extract titles for batch sentiment analysis
    const titles = feed.items.map((item) => item.title || "-");
    const sentiments = await rateHeadlines(titles);

    const cleanItems: ArticleType[] = feed.items.map((item, index) => ({
      title: item.title || "-",
      pubDate: item.pubDate || "",
      isoDate: item.isoDate || "",
      link: item.link || "",
      guid: item.guid || item.link || "",
      content: item.content || "",
      contentSnippet: item.contentSnippet || "",
      sentiment: sentiments[index],
    }));

    return { items: cleanItems };
  } catch (error) {
    console.error("Error while trying to fetch the feed", error);
    throw new Error("Failed to fetch feed.");
  }
}

export const fetchNews = unstable_cache(_fetchFeed, ["newsFeed_v3"], {
  revalidate: 900,
});
