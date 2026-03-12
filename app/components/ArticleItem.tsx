import { ArticleType } from "../page";
import Link from "next/link";

export default function ArticleItem({ children }: { children: ArticleType }) {
  const titleArray = children.title.split(" - ");
  const publisher = titleArray[titleArray.length - 1];
  const title = titleArray.slice(0, titleArray.length - 1).join(" - ");
  const sanitizedLink = children.link.match(/(?<=articles\/)\w+/gm);
  const articleId = sanitizedLink ? sanitizedLink[0] : "";

  return (
    <Link
      href={`/${articleId}`}
      className="border-2 rounded-2xl border-outline border-solid m-3 p-5 overflow-clip transition-colors duration-100 hover:border-accent hover:animate-border-pulse flex"
    >
      <div className="">
        <p className="sm:text-base text-sm">{publisher}</p>
        <h1 className="sm:text-2xl text-lg text-foreground">{title}</h1>
      </div>
    </Link>
  );
}
