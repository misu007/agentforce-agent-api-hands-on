"use client";
import type { StreamingEvent } from "@/types/globals";

type StreamingMessageProps = {
  text: string;
  sequenceId: number;
  sessionId: string;
  onEvent: (streamingEvent: StreamingEvent) => void;
};

export const sendStreamingMessage = async ({
  text,
  sequenceId,
  sessionId,
  onEvent,
}: StreamingMessageProps) => {
  try {
    const res = await fetch("/api/message", {
      method: "POST",
      headers: {
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        message: text,
        sequenceId,
        sessionId,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.log("res", res);
      console.log("errorData", errorData);
      alert(
        `Agentforce API呼び出しでエラーが発生しました: ${errorData.message}`
      );
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) {
      throw new Error("Response body is null");
    }

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;

      const lines = decoder.decode(value).split(/\n/);
      if (lines.length !== 5) continue;

      try {
        const streamingEvent = JSON.parse(lines[2].replace(/^data:\s*/, ""));
        onEvent(streamingEvent);
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    }
  } catch (error) {
    console.error("Error in sendStreamingMessage:", error);
    throw error;
  }
};
