
import { GoogleGenAI, Type } from "@google/genai";
import { SafetyChecklist, SafetyVerdict } from "../types";

export const analyzeSafety = async (checklist: SafetyChecklist): Promise<SafetyVerdict> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Analyze the following travel safety checklist for a field staff member in India.
    Consider Indian road conditions (potholes, traffic density, local risks), weather, and specific hazards.
    
    Checklist Data:
    - Mode: ${checklist.mode}
    - Distance: ${checklist.distance} km
    - Time: ${checklist.time}
    - Valid License: ${checklist.hasValidLicense ? 'Yes' : 'No'}
    - Wearing PPE: ${checklist.isWearingPPE ? 'Yes' : 'No'}
    - PPE Used: ${checklist.ppeDetails.join(', ')}
    - Vehicle Check Done: ${checklist.performedVehicleCheck ? 'Yes' : 'No'}
    - Weather: ${checklist.weatherCondition}
    - Staff Fatigue: ${checklist.isFatigued ? 'Yes' : 'No'}

    Criteria for "UNSAFE":
    - Night driving (9 PM - 4 AM) on Two Wheeler in India is extremely high risk.
    - Missing valid license.
    - Long distance (>50km) on bike at night.
    - Heavy rain/Monsoon conditions for two-wheelers.
    - Lack of mandatory PPE (Helmet for bikes, Seatbelts for cars).
    - No pre-vehicle check.

    Response must be in JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING, description: 'SAFE, UNSAFE, or CAUTION' },
            score: { type: Type.NUMBER, description: 'Safety score from 0 to 100' },
            reasoning: { type: Type.STRING, description: 'Explanation of the verdict' },
            riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["verdict", "score", "reasoning", "riskFactors", "recommendations"],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return result as SafetyVerdict;
  } catch (error) {
    console.error("Error analyzing safety:", error);
    throw new Error("Failed to analyze safety data.");
  }
};
