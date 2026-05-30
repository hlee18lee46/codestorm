import { NextRequest, NextResponse } from "next/server";
import { createBackboardClient } from "@/lib/backboard";
import { createSnowflakeConnection, connectSnowflake } from "@/lib/snowflake";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const connection = createSnowflakeConnection();

  try {
    const body = await req.json();

    const {
      userId = "demo-user",
      topic = "General",
      question,
      threadId,
    } = body;

    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question is required" },
        { status: 400 }
      );
    }

    // 1. Send question to Backboard memory
    const backboard = createBackboardClient();

const memoryResponse = (await backboard.sendMessage({
  content: `User ID: ${userId}
Topic: ${topic}
Student question: ${question}`,
  threadId,
  memory: "Auto",
})) as {
  content: string;
  threadId: string;
};

const memoryContext = memoryResponse.content;
const newThreadId = memoryResponse.threadId;

    // 2. Send memory context to DigitalOcean Gradient AI
    const gradientResponse = await fetch(
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
                "You are StudyChain AI, a friendly AI tutor. Use the student's memory/context to personalize your answer. Keep the explanation clear and beginner-friendly.",
            },
            {
              role: "user",
              content: `
Student memory/context:
${memoryContext}

Current topic:
${topic}

Current question:
${question}
              `,
            },
          ],
          max_tokens: 500,
        }),
      }
    );

    const gradientData = await gradientResponse.json();

    if (!gradientResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Gradient AI request failed",
          details: gradientData,
        },
        { status: gradientResponse.status }
      );
    }

    const aiResponse =
      gradientData?.choices?.[0]?.message?.content ?? "No response returned.";

    // 3. Save study session to Snowflake
    await connectSnowflake(connection);

await new Promise<void>((resolve, reject) => {
  connection.execute({
    sqlText: `
      INSERT INTO MY_DB.PUBLIC.STUDY_SESSIONS (
        ID,
        USER_ID,
        TOPIC,
        QUESTION,
        AI_RESPONSE,
        SCORE,
        CREATED_AT,
        THREAD_ID
      )
      SELECT
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        CURRENT_TIMESTAMP(),
        ?
    `,
    binds: [
      crypto.randomUUID(),
      userId,
      topic,
      question,
      aiResponse,
      0,
      newThreadId,
    ],
    complete: (err) => {
      if (err) reject(err);
      else resolve();
    },
  });
});

    return NextResponse.json({
      success: true,
      userId,
      topic,
      question,
      aiResponse,
      threadId: newThreadId,
      memoryContext,
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  } finally {
    connection.destroy(() => {});
  }
}