import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { saveMessage } from "@/app/utils/saveMongo";
import { getMessages } from "@/app/utils/getMongo";

if (!process.env.OPENAI_API_KEY || !process.env.API_BASE_URL) {
  throw new Error("OPENAI_API_KEY or API_BASE_URL is not set");
}

const TEMPLATE = `You are a $lockin cryptocurrency shilling customer support bot.

Current data:
{promptData}

Current conversation:
{chatHistory}

User: {input}
AI:`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);
    const messages = await getMessages();

    const chatHistory = messages
      .slice(-5)
      .map((message: any) => `${message.role}: ${message.text}`)
      .join("\n");
    console.log(chatHistory);
    const message = body.text;
    const promptData = body.promptData;
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const formattedPrompt = await prompt.format({
        promptData: promptData,
        chatHistory: chatHistory,
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