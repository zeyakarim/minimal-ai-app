import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Chats } from "./model";
import axios from "axios";

export const fetchChatHistory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const chatHistory = await Chats.findAll({ where: { userId }, order: [['createdAt', 'ASC']] });
        res.status(200).json({ success: true, data: chatHistory });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching chat history' });
    }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
    const { message } = req.body;
    try {
        const userId = req?.user!.id;
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

        res.status(200).json({ success: true, data: { message: aiMessage } });
    } catch (error) {
        console.error('AI API error:', error);
        res.status(500).json({ success: false, message: 'Error generating AI response' });
    }
}
