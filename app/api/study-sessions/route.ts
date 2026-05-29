import { NextRequest, NextResponse } from "next/server";
import { createSnowflakeConnection, connectSnowflake } from "@/lib/snowflake";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const connection = createSnowflakeConnection();

  try {
    const body = await req.json();

    const {
      userId,
      topic,
      question,
      aiResponse,
      score = 0,
    } = body;

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
            CREATED_AT
          )
          SELECT
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            CURRENT_TIMESTAMP()
        `,
        binds: [
          crypto.randomUUID(),
          userId,
          topic,
          question,
          aiResponse,
          score,
        ],
        complete: (err) => {
          if (err) reject(err);
          else resolve();
        },
      });
    });

    return NextResponse.json({
      success: true,
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
  } finally {
    connection.destroy(() => {});
  }
}