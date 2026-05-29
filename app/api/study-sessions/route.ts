import { NextRequest, NextResponse } from "next/server";
import { createSnowflakeConnection, connectSnowflake } from "@/lib/snowflake";

export const runtime = "nodejs";

export async function GET() {
  const connection = createSnowflakeConnection();

  try {
    await connectSnowflake(connection);

    const rows = await new Promise<any[]>((resolve, reject) => {
      connection.execute({
        sqlText: `
          SELECT
            ID,
            USER_ID,
            TOPIC,
            QUESTION,
            AI_RESPONSE,
            SCORE,
            CREATED_AT
          FROM MY_DB.PUBLIC.STUDY_SESSIONS
          ORDER BY CREATED_AT DESC
        `,
        complete: (err, stmt, rows) => {
          if (err) reject(err);
          else resolve(rows ?? []);
        },
      });
    });

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Snowflake GET error:", error);

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
    console.error("Snowflake POST error:", error);

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