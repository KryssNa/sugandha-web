// Type definitions
export interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export interface Message {
    id: number;
    type: 'system' | 'user';
    content: string;
    options?: string[];
    isRecommendation?: boolean;
    isTyping?: boolean;
    isFirst?: boolean;
}

export interface QuizState {
    messages: Message[];
    isTyping: boolean;
    userInput: string;
    recommendation: Perfume | null;
}


export interface Perfume {

    id: number;
    name: string;
    brand: string;
    notes: {
        top: string[];
        heart: string[];
        base: string[];
    };
    personality: string[];
    occasion: string[];
    price: number;
    image: string;
    description: string;
    performance: {
        longevity: string;
        sillage: string;
        seasonality: string[];
    };

}

