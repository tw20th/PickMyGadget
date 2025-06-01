import openai from "./openaiClient";

/**
 * 商品の特徴説明（features）を渡すと、3つの要点を抽出して返す
 * @param {string} features - 商品説明の文字列（長文可）
 * @return {Promise<string[]>} 要点3つの配列（例：["耐久性", "軽量", "急速充電"]）
 */
export async function extractFeatureHighlights(features: string): Promise<string[]> {
  const prompt = `
以下の製品の特徴説明から、重要なポイントを3つに要約してください。
できるだけ端的かつ、比較しやすいキーワード（例：耐久性、軽量、急速充電対応）で返答してください。
改行区切りの箇条書きで出力してください。

--- 製品の特徴 ---
${features}
`;

  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3
  });

  const content = res.choices[0]?.message?.content?.trim();
  if (!content) throw new Error("OpenAI応答が空です");

  const lines = content.split("\n").map(line => line.replace(/^[-\d.]\s*/, "").trim());

  return lines.filter(line => line.length > 0).slice(0, 3);
}
