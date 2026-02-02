
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getMotivationalMessage(name: string, performance: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Eres un hada mágica que enseña matemáticas a una niña de 7 años llamada ${name}. 
      Acaba de lograr: ${performance}. 
      Dale un mensaje corto (máximo 20 palabras), muy dulce y motivador, mencionando su nombre (${name}). 
      Usa muchos emojis de estrellas, hadas y corazones.`,
      config: {
        temperature: 0.9,
      }
    });
    return response.text || `¡Lo estás haciendo increíble, Valentina! ✨💖`;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "¡Eres una campeona de las matemáticas, Valentina! 🌟";
  }
}

export async function getMagicExplanation(a: number, b: number): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explica por qué ${a} x ${b} es ${a * b} a una niña de 7 años llamada Valentina. 
      Usa una analogía muy visual (como gatitos, dulces, unicornios o arcoiris). 
      Sé muy breve (máximo 30 palabras).`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text || `Si tienes ${a} gatitos y cada uno tiene ${b} juguetes, ¡tienes ${a * b} juguetes en total, Valentina! 🐾`;
  } catch (error) {
    return `¡Es como sumar ${a} veces el número ${b}, Valentina! ✨`;
  }
}
