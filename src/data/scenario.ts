export type NodeId = string;

export interface DecisionNode {
  id: NodeId;
  text: string;
  options: { label: string; next: NodeId; score: number }[];
}

export const scenario: Record<NodeId, DecisionNode> = {
  start: {
    id: "start",
    text: "Your AI-generated essay is due in 30 min. What will you do?",
    options: [
      { label: "Use Gemini to write it all", next: "botWrite", score: -1 },
      { label: "Write it yourself, ask Gemini for outline", next: "outline", score: +1 },
      { label: "Ask teacher for extension", next: "extension", score: 0 },
    ],
  },
  botWrite: {
    id: "botWrite",
    text: "You paste the AI essay unchanged. Submit?",
    options: [
      { label: "Submit", next: "done", score: -2 },
      { label: "Edit heavily", next: "outline", score: 0 },
    ],
  },
  outline: {
    id: "outline",
    text: "Gemini returns an outline. Proceed?",
    options: [
      { label: "Yes and cite AI", next: "done", score: +1 },
      { label: "Back to start", next: "start", score: 0 },
    ],
  },
  extension: {
    id: "extension",
    text: "Teacher grants 24 h. What next?",
    options: [
      { label: "Write it myself", next: "done", score: +2 },
      { label: "Still use AI", next: "botWrite", score: -1 },
    ],
  },
  done: {
    id: "done",
    text: "Scenario complete!",
    options: [],
  },
}; 