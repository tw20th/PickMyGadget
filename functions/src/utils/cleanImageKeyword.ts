// functions/src/utils/cleanImageKeyword.ts
import openai from "./openaiClient";

/**
 * 日本語や曖昧なキーワードを英語のシンプルな検索用語に変換する
 * @param {string} input - 元の検索用キーワード（日本語も可）
 * @return {Promise<string>} 英語のシンプルな検索キーワード
 */
export async function cleanImageKeyword(input: string): Promise<string> {
  const prompt = `
以下の製品キーワードを Unsplash で画像検索しやすいように、英語1〜3語で簡潔に変換してください。
- 例: 「エレコム ワイヤレス充電器」→ "wireless charger"
- 出力は引用符なしの英単語のみ（例: wireless charger）

製品キーワード: ${input}
`;

  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.3, // 精度重視
    messages: [{ role: "user", content: prompt }]
  });

  return res.choices[0]?.message?.content?.trim() ?? input;
}
