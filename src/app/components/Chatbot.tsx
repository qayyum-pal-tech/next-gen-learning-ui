"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";

interface Message {
    id: number;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Initializing communication link... Greetings, Cadet! How can I assist your navigation today?",
            sender: "bot",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    // Listen for external open requests
    useEffect(() => {
        const handleOpenChatbot = (event: CustomEvent<string>) => {
            setIsOpen(true);
            if (event.detail) {
                const message = `Explain this context: "${event.detail}"`;
                sendMessage(message);
            }
        };

        window.addEventListener("openChatbotWithQuery" as any, handleOpenChatbot as any);
        return () => {
            window.removeEventListener("openChatbotWithQuery" as any, handleOpenChatbot as any);
        };
    }, []);

    const sendMessage = async (messageOverride?: string) => {
        const messageToSend = messageOverride || input;
        
        if (!messageToSend.trim() || loading) return;

        const userMessage = messageToSend.trim();
        if (!messageOverride) setInput(""); // Only clear input if not override

        // Add user message
        const userMsg: Message = {
            id: messages.length + 1,
            text: userMessage,
            sender: "user",
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await response.json();

            const botMsg: Message = {
                id: messages.length + 2,
                text: data.success ? data.message : "Error: " + data.message,
                sender: "bot",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            const errorMsg: Message = {
                id: messages.length + 2,
                text: "Communication relay offline. Unable to reach command center.",
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60]">
            <AnimatePresence>
                {!isOpen ? (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                    >
                        <Button
                            onClick={() => setIsOpen(true)}
                            size="lg"
                            className="h-16 w-16 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)] bg-gradient-to-tr from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-2 border-cyan-400/30"
                        >
                            <MessageCircle className="h-8 w-8 text-white animate-pulse" />
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="relative"
                    >
                        {/* Glassmorphic Container */}
                        <div className="w-[380px] h-[600px] flex flex-col rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 bg-[#050510]/95 backdrop-blur-xl">

                            {/* Header */}
                            <div className="relative p-4 border-b border-white/10 bg-gradient-to-r from-cyan-900/20 to-purple-900/20">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-cyan-400/20 blur-md rounded-full" />
                                            <Avatar className="h-10 w-10 border border-cyan-400/50 bg-black/50">
                                                <AvatarFallback className="bg-transparent text-cyan-400">
                                                    <Bot className="h-5 w-5" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#050510] animate-pulse" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-base">LearnBot AI</h3>
                                            <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
                                                ONLINE
                                            </Badge>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsOpen(false)}
                                        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-[#050510] to-[#050510]">
                                <ScrollArea className="h-full px-4 py-4">
                                    <div className="space-y-4">
                                        {messages.map((msg) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                key={msg.id}
                                                className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                                            >
                                                <Avatar className={`h-8 w-8 border ${msg.sender === "user" ? "border-purple-500/30 bg-purple-500/10" : "border-cyan-500/30 bg-cyan-500/10"}`}>
                                                    <AvatarFallback className="bg-transparent">
                                                        {msg.sender === "user" ? (
                                                            <User className="h-4 w-4 text-purple-400" />
                                                        ) : (
                                                            <Bot className="h-4 w-4 text-cyan-400" />
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div
                                                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm border ${msg.sender === "user"
                                                            ? "bg-purple-600/20 border-purple-500/20 text-purple-100 rounded-br-none"
                                                            : "bg-cyan-900/20 border-cyan-500/20 text-cyan-100 rounded-bl-none"
                                                        }`}
                                                >
                                                    <p className="leading-relaxed">{msg.text}</p>
                                                    <p className="text-[10px] mt-1.5 opacity-50 flex items-center justify-end gap-1">
                                                        {msg.timestamp.toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}

                                        {loading && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex gap-3"
                                            >
                                                <Avatar className="h-8 w-8 border border-cyan-500/30 bg-cyan-500/10">
                                                    <AvatarFallback className="bg-transparent">
                                                        <Bot className="h-4 w-4 text-cyan-400" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="bg-cyan-900/10 border border-cyan-500/10 rounded-2xl rounded-bl-none px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <Loader2 className="h-3 w-3 text-cyan-400 animate-spin" />
                                                        <span className="text-xs text-cyan-300/70">Processing request...</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </ScrollArea>
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-[#050510]/80 border-t border-white/10 backdrop-blur-md">
                                <div className="relative">
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Enter command..."
                                        className="pr-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-cyan-500/50 focus-visible:border-cyan-500/50 h-11"
                                        disabled={loading}
                                    />
                                    <Button
                                        onClick={() => sendMessage()}
                                        disabled={loading || !input.trim()}
                                        size="icon"
                                        className="absolute right-1 top-1 h-9 w-9 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md transition-all"
                                    >
                                        {loading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Send className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                <div className="flex justify-between items-center mt-2 px-1">
                                    <p className="text-[10px] text-gray-500">
                                        AI Navigation Assistant v2.0
                                    </p>
                                    <Zap className="w-3 h-3 text-yellow-500/50" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}