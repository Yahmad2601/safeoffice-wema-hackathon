import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

export const LLM = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY,
});

export const GROQ = new ChatGroq({
  model: "llama3-8b-8192",
  temperature: 0,
  apiKey: process.env.GROQ_API_KEY,
});