import axios from "axios";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CohereClient } from "cohere-ai";

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const cohere = process.env.COHERE_API_KEY
  ? new CohereClient({ token: process.env.COHERE_API_KEY })
  : null;

// your msg is like: [{ role:"user", content:"..." }]
const getLastUserText = (msg = []) =>
  [...msg].reverse().find((m) => m?.role === "user")?.content ?? "";

// cohere needs a string prompt (simple)
const messagesToPrompt = (msg = []) =>
  msg
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

export async function POST(req) {
  try {
    const { model, msg, parentModel } = await req.json();

    if (!model) {
      return NextResponse.json({ error: "Missing model" }, { status: 400 });
    }

    // ✅ GEMINI (FREE)
    // Make sure your modelId looks like: "gemini-1.5-flash" / "gemini-1.5-pro"
    if (String(model).startsWith("gemini")) {
      if (!genAI) {
        return NextResponse.json(
          { error: "GEMINI_API_KEY missing" },
          { status: 500 }
        );
      }

      const geminiModel = genAI.getGenerativeModel({ model: String(model) });
      const input = getLastUserText(msg);

      const result = await geminiModel.generateContent(input);
      const text = result.response.text();

      return NextResponse.json({
        aiResponse: text,
        model: parentModel,
      });
    }

if (String(model).startsWith("cohere")) {
  if (!cohere) {
    return NextResponse.json(
      { error: "COHERE_API_KEY missing" },
      { status: 500 }
    );
  }


  const cohereModel =
    model === "cohere-command-a"
      ? "command-a-03-2025"
      : model === "cohere-command-r-08-2024"
      ? "command-r-08-2024"
      : model === "cohere-command-r-plus-08-2024"
      ? "command-r-plus-08-2024"
      : "command-a-03-2025"; // safe default

  const prompt = messagesToPrompt(msg);

  const resp = await cohere.chat({
    model: cohereModel,
    message: prompt,
  });

  return NextResponse.json({
    aiResponse: resp.text ?? "",
    model: parentModel,
  });
}

    // ✅ fallback = KRAVIXSTUDIO (your current setup)
    const response = await axios.post(
      "https://kravixstudio.com/api/v1/chat",
      {
        message: msg,
        aiModel: model,
        outputType: "text",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.KRAVIXSTUDIO_API_KEY,
        },
      }
    );

    return NextResponse.json({
      ...response.data,
      model: parentModel,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Server error", details: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
