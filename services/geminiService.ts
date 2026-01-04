
import { GoogleGenAI } from "@google/genai";

export const getDanceConsultantResponse = async (userPrompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userPrompt,
      config: {
        systemInstruction: "You are the head consultant at THEART DANCE STUDIO. You are energetic, professional, and knowledgeable about all styles of dance (Urban, Hip-hop, Ballet, Jazz, Contemporary). Help users find classes, provide motivation, or explain dance terminology. Keep responses concise and inspiring.",
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having a bit of trouble connecting to the stage. Try asking me again in a moment!";
  }
};
