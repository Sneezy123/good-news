import { decodeURL } from "@/server/decodeGoogleNewsURL";
import { Readability } from "@mozilla/readability";
import DOMPurify from "isomorphic-dompurify";
import { JSDOM } from "jsdom";

type ParsedArticle = {
  title: string | null | undefined;
  content: string | null | undefined;
  textContent: string | null | undefined;
  length: number | null | undefined;
  excerpt: string | null | undefined;
  byline: string | null | undefined;
  dir: string | null | undefined;
  siteName: string | null | undefined;
  lang: string | null | undefined;
  publishedTime: string | null | undefined;
} | null;

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ articleId: string }>;
}) {
  const { articleId } = await params;

  const articleUrl = await decodeURL(encodeURIComponent(articleId));

  const fetchRes = await fetch(articleUrl);
  const fetchResText = await fetchRes.text();

  const dom = new JSDOM(fetchResText, { url: articleUrl });

  const reader = new Readability(dom.window.document);
  const article: ParsedArticle = reader.parse();
  let content: string = "No text found";
  let title: string = "...";
  let siteName: string = "";
  let pubTime: string = new Date().toLocaleString();

  if (article) {
    if (article.content) {
      content = DOMPurify.sanitize(article.content, {
        ALLOWED_TAGS: [
          "b",
          "i",
          "em",
          "strong",
          "a",
          "p",
          "h1",
          "h2",
          "h3",
          "img",
          "ul",
          "li",
          "div",
        ],
        ALLOWED_ATTR: ["href", "src", "alt", "hidden"],
      });
    }
    if (article.title) title = article.title;
    if (article.siteName) siteName = article.siteName;
    if (article.publishedTime) {
      const pubDate = new Date(Date.parse(article.publishedTime));
      pubTime = pubDate.toLocaleString();
    }
  }
  return (
    article && (
      <div className="max-w-400 w-[60dvw] min-w-100 mx-auto py-10 ">
        <h1 className="font-bold text-4xl">{title}</h1>
        <div className="flex flex-row gap-5 mb-5 mt-2 text-lg">
          <p className="font-bold">{siteName}</p>
          <p>{pubTime}</p>
        </div>
        <div className="w-full h-0.5 bg-white/30 mb-4"></div>
        <div
          className="[&_h2]:text-2xl [&_h3]:text-xl [&_p]:my-5 [&_p]:text-base  [&_a]:text-blue-400"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </div>
    )
  );
}
