import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage } from "ai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { saveMessage } from "../../utils/saveMongo";

if (!process.env.OPENAI_API_KEY || !process.env.API_BASE_URL) {
  throw new Error("OPENAI_API_KEY or API_BASE_URL is not set");
}

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are a $lockin cryptocurrency shilling customer support bot.

Current conversation:

User: {input}
AI:`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);

    const message = body.text;
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const formattedPrompt = await prompt.format({
        input: message,
      });
    
    const model = new ChatOpenAI({
      temperature: 0.8,
      model: "gpt-4o-mini",
      cache: true,
    });

    const response = await model.invoke(formattedPrompt);

    console.log(response);
    const completeMessage = response.text;

    await saveMessage(completeMessage, "assistant");

    return NextResponse.json({ text: completeMessage });
  } catch (e: any) {
    console.log(e);
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}