import { ArticleType } from "../page";
import Link from "next/link";
import SentimentIndicator from "./SentimentIndicator";

export default function ArticleItem({ children }: { children: ArticleType }) {
  const titleArray = children.title.split(" - ");
  const publisher = titleArray[titleArray.length - 1];
  const title = titleArray.slice(0, titleArray.length - 1).join(" - ");
  const sanitizedLink = children.link.match(/articles\/(.+)\?/);
  const articleId = sanitizedLink ? sanitizedLink[1] : "";

  // Map nuanced score (-1 to 1) to emojis
  const getSentimentInfo = (score: number = 0) => {
    if (score >= 0.6) return { score: score, label: "Sehr positiv" };
    if (score >= 0.2) return { score: score, label: "Positiv" };
    if (score > -0.2) return { score: score, label: "Neutral" };
    if (score > -0.6) return { score: score, label: "Negativ" };
    return { score: score, label: "Sehr negativ" };
  };

  const sentiment = getSentimentInfo(children.sentiment?.score);

  return (
    <Link
      href={`/${articleId}`}
      className="border-2 rounded-2xl border-outline border-solid m-3 p-5 overflow-clip transition-colors duration-100 hover:border-accent hover:animate-border-pulse flex items-center justify-between"
    >
      <div className="flex-1">
        <p className="sm:text-base text-sm opacity-70">{publisher}</p>
        <h1 className="sm:text-2xl text-lg text-foreground font-medium">{title}</h1>
      </div>
      <div className="text-3xl ml-4" title={`${sentiment.label} (${children.sentiment?.score?.toFixed(2)})`}>
        <SentimentIndicator score={sentiment.score} />
      </div>
    </Link>
  );
}
