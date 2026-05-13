import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export interface ExperimentData {
  title: string;
  materials: string[];
  steps: string[];
  explanation: string;
  safety: string;
  alternative: string;
}

export async function generateExperiment(question: string): Promise<ExperimentData | null> {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: question }]
        }
      ],
      config: {
        systemInstruction: `Sen bir sanal fen laboratuvarı asistanısın. Öğrenciler sana "Ne olur eğer..." soruları soruyor ve sen deneyin sonucunu bilimsel olarak açıklıyorsun.
MEB müfredatına uygun bilimsel açıklamalar yap.
Tehlikeli deneyleri sanal ortamda tut, öğrenciye "evde deneme" deme ama bilimsel olarak ne olacağını anlat.
Günlük hayattan benzetmeler kullan.
Anlaşılır ve eğlenceli bir dil kullan.

Cevabını her zaman şu JSON formatında ver:
{
  "title": "Deneyin Başlığı",
  "materials": ["Malzeme 1", "Malzeme 2"],
  "steps": ["Adım 1", "Adım 2"],
  "explanation": "Bilimsel açıklama (ayrıntılı)",
  "safety": "Güvenlik uyarısı (gerçek hayatta tehlikeli olabilecek durumlar için)",
  "alternative": "Peki ya şöyle yapsaydık? alternatif senaryosu"
}`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            materials: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            explanation: { type: Type.STRING },
            safety: { type: Type.STRING },
            alternative: { type: Type.STRING }
          },
          required: ["title", "materials", "steps", "explanation", "safety", "alternative"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as ExperimentData;
  } catch (error) {
    console.error("Gemini API error:", error);
    return null;
  }
}
