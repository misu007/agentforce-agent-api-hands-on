import { NextRequest, NextResponse } from "next/server";
import { sendStreamingMessage } from "@/utils/agentforce";

export async function POST(req: NextRequest) {
  const { message, sequenceId, sessionId } = await req.json();
  try {
    const contentStream = await sendStreamingMessage(
      sessionId,
      message,
      sequenceId
    );
    if (!contentStream)
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    const headers = new Headers({
      "Content-Type": "text/event-stream",
    });
    return new NextResponse(contentStream, {
      status: 200,
      headers,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : error;
    return NextResponse.json(
      { error: "Internal Server Error", message: errorMessage },
      { status: 500 }
    );
  }
}
