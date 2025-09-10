import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "../api";

interface ChatMessage {
    id: string;
    userId: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: string;
}

// Custom hook to fetch chat history
export const useChatHistory = () => {
    return useQuery({
        queryKey: ['chatHistory'],
        queryFn: async () => {
            const res = await fetcher('/chat/history', 'GET');
            if (!res || !res.data) {
                return res.message;
            }

            return res.data;
        },
        staleTime: 1000 * 60, // Data is fresh for 1 minute
    });
};

// Custom hook to send a new message
export const useSendMessageMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (message: string) => {
            const res = await fetcher<{ message: string }>('/chat/send', 'POST', { message });
            return res.data;
        },
        onSuccess: (data, message) => {
            // Optimistically update the UI with the user's message
            queryClient.setQueryData<ChatMessage[]>(['chatHistory'], (oldData: any) => {
                const newMessage = { id: Date.now().toString(), userId: '', role: 'user', content: message, createdAt: new Date().toISOString() };
                return [...(oldData || []), newMessage];
            });
            // Then, refetch the full history to get the AI's response
            queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
            console.log("Message sent successfully:", data);
        },
        onError: (error: any) => {
            console.error("Message send failed:", error.message);
        }
    });
};