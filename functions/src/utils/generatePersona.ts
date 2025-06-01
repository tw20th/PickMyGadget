import openai from "./openaiClient";
import { personaPromptTemplate } from "../prompts/personaPrompt";

export async function generatePersona(category: string): Promise<string> {
  // テンプレートの {{PRODUCT_CATEGORY}} を置換
  const prompt = personaPromptTemplate.replace(/{{PRODUCT_CATEGORY}}/g, category);

  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8 // 少しバリエーションを出す設定
  });

  const content = res.choices[0]?.message?.content?.trim();
  if (!content) throw new Error("OpenAI からの応答が空でした");

  return content;
}
