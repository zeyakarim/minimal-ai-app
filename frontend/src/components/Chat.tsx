import { useState, useRef, useEffect } from 'react';
import { useChatHistory, useSendMessageMutation } from '../api/chatApis';
import { FaPaperPlane, FaSpinner, FaUser, FaRobot, FaSignOutAlt } from 'react-icons/fa';

interface ChatProps {
    onLogout: () => void;
}

const Chat: React.FC<ChatProps> = ({ onLogout }) => {
    const [message, setMessage] = useState('');
    const { data: messages, isLoading, isError } = useChatHistory();
    const sendMessageMutation = useSendMessageMutation();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, sendMessageMutation.isPending]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            sendMessageMutation.mutate(message.trim());
            setMessage('');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <header className="flex items-center justify-between p-4 bg-white shadow-md">
                <h1 className="text-xl font-bold text-gray-800">AI Chat Support</h1>
                <button onClick={onLogout} className="text-red-500 hover:text-red-700">
                    <FaSignOutAlt className="inline-block mr-2" />
                    Logout
                </button>
            </header>

            <div className="flex-1 p-4 overflow-y-auto">
                {isLoading && (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <FaSpinner className="animate-spin" /> Loading chat history...
                    </div>
                )}
                {isError && (
                    <div className="flex items-center justify-center h-full text-red-500">
                        Error fetching chat history.
                    </div>
                )}

                {messages && Array.isArray(messages) && messages?.map((msg: any, index: number) => (
                    <div
                        key={index}
                        className={`flex items-start mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                    >
                        {msg.role === 'assistant' && (
                            <div className="p-3 mr-3 text-white bg-indigo-500 rounded-full">
                                <FaRobot />
                            </div>
                        )}
                        <div
                            className={`p-4 rounded-lg shadow-sm max-w-lg ${msg.role === 'user'
                                    ? 'bg-blue-500 text-white rounded-br-none'
                                    : 'bg-white text-gray-800 rounded-bl-none'
                                }`}
                        >
                            {msg.content}
                        </div>
                        {msg.role === 'user' && (
                            <div className="p-3 ml-3 text-white bg-blue-500 rounded-full">
                                <FaUser />
                            </div>
                        )}
                    </div>
                ))}
                {/* End of corrected section */}

                {sendMessageMutation.isPending && (
                    <div className="flex items-start mb-4">
                        <div className="p-3 mr-3 text-white bg-indigo-500 rounded-full">
                            <FaRobot />
                        </div>
                        <div className="p-4 rounded-lg shadow-sm bg-gray-200 text-gray-800 animate-pulse">
                            AI is typing...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white shadow-lg">
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={sendMessageMutation.isPending}
                    />
                    <button
                        type="submit"
                        className="flex items-center justify-center w-12 h-12 text-white bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={sendMessageMutation.isPending}
                    >
                        <FaPaperPlane />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;