import openai from "../utils/openaiClient";
import fs from "fs";
import path from "path";

/**
 * プロンプトテンプレートファイルを読み込む
 * @return {string} テンプレート文字列
 */
function loadPromptTemplate(): string {
  const filePath = path.resolve(__dirname, "../../prompts/blogPromptTemplate.txt");
  return fs.readFileSync(filePath, "utf8");
}

/**
 * テンプレート内の {{key}} を values で置き換える
 * @param {string} template テンプレート文字列（{{productName}}などを含む）
 * @param {Record<string, string>} values キーと値のペアで置換対象を指定するオブジェクト
 * @return {string} 埋め込み済みの文字列
 */
function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/{{(.*?)}}/g, (_, key) => values[key.trim()] || "");
}

type GenerateBlogContentParams = {
  productName: string;
  price: string;
  features: string;
  featureHighlights?: string[];
};

/**
 * ChatGPT API を使用してブログ記事を生成する
 * @param {string} productName 商品名
 * @param {string} price 価格
 * @param {string} features 商品の特徴（文章）
 * @param {string[]} [featureHighlights] 商品の特徴（箇条書き）
 * @return {Promise<string>} 生成された記事本文（Markdown形式推奨）
 */
export async function generateBlogContent({
  productName,
  price,
  features,
  featureHighlights = []
}: GenerateBlogContentParams): Promise<string> {
  const rawTemplate = loadPromptTemplate();
  const filledPrompt = fillTemplate(rawTemplate, {
    productName,
    price,
    features,
    featureHighlights: featureHighlights.join("・") || "（情報なし）"
  });

  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k", // ← 長文対応（最大16K tokens）
    messages: [{ role: "user", content: filledPrompt }]
  });

  const content = res.choices[0]?.message?.content?.trim();
  if (!content) throw new Error("OpenAI応答なし");

  return content;
}
