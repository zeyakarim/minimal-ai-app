import axios, { AxiosError } from "axios";
import { Chats } from "./model";

interface MessagePayload {
    message: string;
}

const sendMessageService = async (payload: MessagePayload, userId: string) => {
    const { message } = payload;
    try {
        await Chats.create({ userId, role: 'user', content: message });

        const openRouterResponse = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'mistralai/mistral-7b-instruct',
                messages: [{ role: 'user', content: message }],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const aiMessage = openRouterResponse.data.choices[0].message.content;
        await Chats.create({ userId, role: 'assistant', content: aiMessage });

        return aiMessage;
    } catch (error) {
        console.error('AI API error:', error);
        if (error instanceof AxiosError && error?.response?.status === 401) {
            console.error('❌ OpenRouter API key has expired or is invalid');
            
            await Chats.create({
                userId,
                role: 'assistant',
                content: 'Sorry, my AI service is currently unavailable due to configuration issues. Please try again later or contact support.'
            });
            
            throw new Error('AI service configuration error. Please contact support.');
        }
    }
};

export { sendMessageService }