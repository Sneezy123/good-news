export async function decodeURL(articleId: string): Promise<string> {
  const res = await fetch(`http://localhost:3000/api/news?id=${articleId}`);
  return res.text();
}
