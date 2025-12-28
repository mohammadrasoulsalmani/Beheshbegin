
import { GoogleGenAI, Type } from "@google/genai";
import { MessageSource, Language, LocalizedString } from '../types';

interface AiMessageResult {
  text: string;
  sourceLabel: LocalizedString;
  reference: LocalizedString;
}

const getAIGenAIInstance = () => {
  // CRITICAL: Create a new GoogleGenAI instance right before making an API call
  // to ensure it always uses the most up-to-date API key from the dialog.
  // In a real application, process.env.API_KEY would be securely managed.
  return new GoogleGenAI({ apiKey: process.env.API_KEY || 'YOUR_GEMINI_API_KEY_HERE' });
}

// Simulate fetching a wisdom insight from AI based on a message
export const getMessageWisdom = async (messageText: string, emotionLabel: string): Promise<string> => {
  try {
    const ai = getAIGenAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following message for its emotional impact and provide a short, profound wisdom insight (2-3 sentences) related to the emotion "${emotionLabel}" and the message content: "${messageText}". Respond only with the wisdom insight.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 150,
        systemInstruction: 'You are a wise and empathetic AI that provides comforting and insightful wisdom based on ancient texts and psychological understanding.',
      },
    });
    return response.text?.trim() || 'No wisdom insight found.';
  } catch (error) {
    console.error('Error fetching AI wisdom:', error);
    // Handle specific errors like "Requested entity was not found." for API key re-selection
    if (error instanceof Error && error.message.includes("Requested entity was not found.")) {
      // Assuming a global mechanism to prompt for API key re-selection
      // For this example, we'll just log and suggest it.
      console.warn("API key might be invalid or not selected. Please re-select your API key.");
    }
    return 'Failed to retrieve wisdom insight. Please try again later.';
  }
};

// Simulate searching for AI-generated messages based on a query
export const searchAiMessages = async (query: string, emotionLabel: string, lang: Language): Promise<AiMessageResult[]> => {
  try {
    const ai = getAIGenAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 3 short, comforting messages (2-3 sentences each) in ${lang} based on the query "${query}" and related to the emotion "${emotionLabel}". For each message, provide a fictional 'sourceLabel' (e.g., 'حکمت کهن', 'Ancient Wisdom', 'حكمة قديمة') and a fictional 'reference' (e.g., 'ضرب‌المثل ایرانی', 'Proverb', 'مثل عربي'). Format the response as a JSON array of objects with 'text', 'sourceLabel', and 'reference' properties.`,
      config: {
        temperature: 0.9,
        maxOutputTokens: 300,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              sourceLabel: { type: Type.STRING },
              reference: { type: Type.STRING },
            },
            required: ['text', 'sourceLabel', 'reference'],
          },
        },
        systemInstruction: 'You are a compassionate AI assisting in finding comforting messages.',
      },
    });

    const jsonStr = response.text?.trim();
    if (jsonStr) {
      // Parse the JSON string and map it to the expected interface
      const rawResults = JSON.parse(jsonStr);
      return rawResults.map((r: any) => ({
        text: r.text,
        sourceLabel: { fa: r.sourceLabel, en: r.sourceLabel, ar: r.sourceLabel } as LocalizedString,
        reference: { fa: r.reference, en: r.reference, ar: r.reference } as LocalizedString,
      }));
    }
    return [];
  } catch (error) {
    console.error('Error searching AI messages:', error);
    if (error instanceof Error && error.message.includes("Requested entity was not found.")) {
      console.warn("API key might be invalid or not selected. Please re-select your API key.");
    }
    return [];
  }
};

// Placeholder for other API service calls
export const apiService = {
  // Simulate sending an SMS
  sendSMS: async (to: string, message: string, customSender: string | undefined = undefined) => { // Removed customText
    console.log(`Sending SMS to: ${to}`);
    console.log(`Main Message: ${message}`);
    if (customSender) {
      console.log(`Custom Sender: ${customSender}`);
    }
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    return { success: true, message: 'SMS sent successfully.' };
  },

  // Simulate user authentication
  authenticate: async (phoneNumber: string) => {
    console.log(`Authenticating phone number: ${phoneNumber}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, token: 'fake-jwt-token' };
  },

  // Simulate processing a payment
  processPayment: async (amount: number, recipientNumber: string, messageId: string) => {
    console.log(`Processing payment of ${amount} for message ${messageId} to ${recipientNumber}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { success: true, transactionId: 'txn_12345' };
  },

  // Simulate subscribing to daily messages
  subscribeDailyMessages: async (phoneNumber: string, sources: MessageSource[], price: number) => {
    console.log(`Subscribing ${phoneNumber} to daily messages from ${sources.join(', ')} for ${price}`);
    await new Promise(resolve => setTimeout(resolve, 2500));
    return { success: true, subscriptionId: 'sub_67890' };
  },
};
