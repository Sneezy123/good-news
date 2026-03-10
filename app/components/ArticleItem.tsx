import { useQuery } from "@tanstack/react-query";
import { ArticleType } from "../page";
//import { decodeGoogleNewsUrl } from "@/server/decodeGoogleNewsURL";

export default function ArticleItem({ children }: { children: ArticleType }) {
  //   const { data, isLoading, isSuccess } = useQuery<any>({
  //     queryKey: ["urlDecode"],
  //     queryFn: () => decodeGoogleNewsUrl(children.link),
  //   });
  const titleArray = children.title.split(" - ");
  const publisher = titleArray[titleArray.length - 1];
  const title = titleArray.slice(0, titleArray.length - 1).join(" - ");
  return (
    <a
      href={children.link}
      className="border-2 rounded-2xl border-outline border-solid m-3 p-5 overflow-clip transition-colors duration-100 hover:border-accent hover:animate-border-pulse flex"
    >
      <div className="">
        <p className="sm:text-base text-sm">{publisher}</p>
        <h1 className="sm:text-2xl text-lg text-foreground">{title}</h1>
      </div>
    </a>
  );
}
