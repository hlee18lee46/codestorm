import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      question,
      topic = "General",
      userId = "anonymous",
    } = body;

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          error: "Question is required",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://inference.do-ai.run/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DIGITALOCEAN_MODEL_ACCESS_KEY}`,
        },
        body: JSON.stringify({
          model: "mistral-3-14B",
          messages: [
            {
              role: "system",
              content:
                "You are StudyChain AI. Explain concepts clearly for students and provide examples.",
            },
            {
              role: "user",
              content: `Topic: ${topic}\nQuestion: ${question}`,
            },
          ],
          max_tokens: 500,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);

      return NextResponse.json(
        {
          success: false,
          error: "DigitalOcean Gradient request failed",
          details: data,
        },
        { status: response.status }
      );
    }

    const aiResponse =
      data?.choices?.[0]?.message?.content ??
      "No response returned.";

    return NextResponse.json({
      success: true,
      userId,
      topic,
      question,
      aiResponse,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}