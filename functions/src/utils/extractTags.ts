import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function extractTagsFromFeatures(highlights: string[]): Promise<string[]> {
  const prompt = `
以下の商品の特徴からSEOに強いタグを5個抽出してください。
- 出力形式: ["タグ1", "タグ2", "タグ3", "タグ4", "タグ5"]
- 可能であれば短めに
- 重複や似た意味は除外
- カテゴリに関係する用語を優先

特徴一覧:
${highlights.join("\n")}
`;

  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7
  });

  const text = res.choices[0].message.content || "";
  const match = text.match(/\[.*?\]/s);

  if (!match) return [];

  try {
    const tags = JSON.parse(match[0]);
    return Array.isArray(tags) ? tags.map(tag => String(tag)) : [];
  } catch {
    return [];
  }
}
