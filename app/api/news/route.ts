import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const DATA_ID = searchParams.get("id");

  const requestHeaders = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    Accept: "*/*",
    "Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua":
      '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    priority: "u=1, i",
  };

  const reqRes = await fetch(
    `https://news.google.com/rss/articles/${DATA_ID}?oc=5`,
    { headers: requestHeaders, cache: "no-store" },
  );
  const htmlData = await reqRes.text();

  const setCookieHeaders = reqRes.headers.getSetCookie();
  // Transform["NID=511=abc; expires=...", "AEC=xyz; path=/"] into "NID=511=abc; AEC=xyz"
  const sessionCookies = setCookieHeaders
    .map((cookie) => cookie.split(";")[0])
    .join("; ");

  const timestampMatch = /(?<=data-n-a-ts=")\d+/gm.exec(htmlData);
  const signatureMatch = /(?<=data-n-a-sg=")[^"]+/gm.exec(htmlData);

  const DATA_TS = timestampMatch ? timestampMatch[0] : "0";
  const DATA_SG = signatureMatch ? signatureMatch[0] : "";

  const innerJson: string = `[\"garturlreq\",[[\"de\",\"DE\",[\"FINANCE_TOP_INDICES\",\"GENESIS_PUBLISHER_SECTION\",\"WEB_TEST_1_0_0\"],null,null,1,1,\"DE:de\",null,60,null,null,null,null,null,0,5,null,[1587581958,545000000]],\"de\",\"DE\",1,[3,4,5,9,19],1,0,\"880630488\",0,0,null,0],\"${DATA_ID}\",${DATA_TS},\"${DATA_SG}\"]`;
  const formDataArray = [[["Fbv4je", innerJson, null, "generic"]]];
  const formData = JSON.stringify(formDataArray);

  const res = await fetch(
    "https://news.google.com/_/DotsSplashUi/data/batchexecute",
    {
      method: "POST",
      referrer: "https://news.google.com/",
      headers: {
        ...requestHeaders,
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
        Cookie: sessionCookies,
      },
      body: "f.req=" + encodeURIComponent(formData),
      cache: "no-store",
    },
  );

  const data = await res.text();
  const splitData = data.split("\\");

  if (splitData[3]) {
    return new Response(splitData[3].slice(1), { status: 200 });
  } else {
    return new Response("No url found", { status: 503 });
  }
}
