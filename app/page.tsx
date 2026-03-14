"use client";

import { useQuery } from "@tanstack/react-query";
import ArticleItem from "@/app/components/ArticleItem";
import SearchBar from "@/app/components/SearchBar";
import { fetchNews } from "@/server/fetchNews";

export type ArticleType = {
  title: string;
  pubDate: string;
  isoDate: string;
  link: string;
  guid: string;
  content: string;
  contentSnippet: string;
};

export type NewsData = {
  items: ArticleType[];
};

export default function Home() {
  const GOOGLE_NEWS_URL = "https://news.google.com/rss?num=8&hl=de&gl=DE";

  const {
    data: newsData,
    isLoading: newsLoading,
    isSuccess: newsLoaded,
  } = useQuery<NewsData>({
    queryKey: ["news"],
    queryFn: () => fetchNews(GOOGLE_NEWS_URL),
  });

  if (newsLoading) {
    return <div className="w-full h-dvh flex flex-col justify-center items-center">
      <p className="animate-bounce text-lg">Nachrichten werden geladen...</p>
    </div>
  } else if (newsLoaded && newsData.items) {
    console.log(newsData);
    return (
      <>
        <div className="px-6 flex flex-row gap-5 py-3 justify-between top-0 sticky bg-background ">
          <p className="text-center text-3xl sm:block hidden">Nachrichten</p>
          <SearchBar />
        </div>
        {newsData.items.map((article: ArticleType) => (
          <ArticleItem key={article.guid}>{article}</ArticleItem>
        ))}
      </>
    );
  } else {
    return <p>Error</p>;
  }
}
