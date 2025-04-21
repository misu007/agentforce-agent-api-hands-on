export type Message = {
  type: "ai" | "user";
  message: string;
  aiStatus?: string;
  isTyping?: boolean;
};

export type TextChunk = {
  chunk: string;
  offset: number;
};

export type StreamingEvent = {
  type: string;
  message: {
    type: string;
    message: string;
  };
  offset: number;
};
