import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Chats } from "./model";
import { sendMessageService } from "./services";

export const fetchChatHistory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const chatHistory = await Chats.findAll({ where: { userId }, order: [['createdAt', 'ASC']] });
        res.status(200).json({ success: true, data: chatHistory });
    } catch (error) {
        const errorMessage = error instanceof Error ? error?.message : 'Error fetching chat history';
        res.status(500).json({ success: false, message:  errorMessage });
    }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
    try {
        const aiMessage = await sendMessageService(req?.body, req?.user!.id)
        res.status(200).json({ success: true, data: { message: aiMessage } });
    } catch (error) {
        console.error('AI API error:', error);
        const errorMessage = error instanceof Error ? error?.message : 'Error generating AI response';
        res.status(500).json({ success: false, message: errorMessage });
    }
}
