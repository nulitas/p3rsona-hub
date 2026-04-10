"use server";

import { PORTFOLIO_CONTEXT } from "@/prompts-data";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY environment variable is not set");
}

export async function generateChatResponse(
  message: string,
): Promise<{ success: boolean; response?: string; error?: string }> {
  if (!apiKey) {
    return {
      success: false,
      error:
        "Gemini API key not configured. Please set GEMINI_API_KEY environment variable.",
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
      systemInstruction: PORTFOLIO_CONTEXT,
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response
      .text()
      .replace(/\*\*|\*/g, "")
      .replace(/^\s*[-*]\s+/gm, "");

    return {
      success: true,
      response: text,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      error: "Failed to generate response. Please try again.",
    };
  }
}

export async function generateImage(prompt: string): Promise<string> {
  if (!apiKey) {
    throw new Error(
      "Gemini API key not configured. Please set GEMINI_API_KEY environment variable.",
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-preview-image-generation",
      generationConfig: {
        responseModalities: ["image", "text"],
      } as any,
    });

    const enhancedPrompt = `Create an 8-bit pixel art character in classic retro game style. ${prompt}. The character should have clear details, bright and contrasting colors, with consistent pixel art style like 80-90s arcade games.`;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;

    if (response.promptFeedback?.blockReason) {
      throw new Error(
        `Content blocked: ${response.promptFeedback.blockReason}`,
      );
    }

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      throw new Error("No content parts in response");
    }

    const imagePart = parts.find((part) => part.inlineData);
    if (!imagePart?.inlineData) {
      throw new Error("No image data found in response");
    }

    const base64Data = imagePart.inlineData.data;
    const mimeType = imagePart.inlineData.mimeType || "image/png";
    return `data:${mimeType};base64,${base64Data}`;
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw new Error("Failed to generate image. Please try again.");
  }
}
