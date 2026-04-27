import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import '../ComponentCSS/AIAssistant.css';

// 🚨 PASTE YOUR GEMINI API KEY HERE 🚨
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm Parkly AI ✨. Tell me where you want to go, and I'll give you the best parking advice for that area!", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to the bottom of the chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
        setInput('');
        setIsLoading(true);

        try {
            const historyData = localStorage.getItem('parkingHistory') || "No past bookings yet.";

            // --- THE NEW MAGIC PROMPT ---
            // This forces the AI to use its real-world geographical knowledge!
            const systemPrompt = `
                You are Parkly AI, a highly intelligent parking and mobility assistant for a hackathon project.
                The user is going to ask you about parking in a specific real-world city or neighborhood.
                
                YOUR INSTRUCTIONS:
                1. Act as a Local Guide. Use your geographical knowledge to provide realistic advice about parking in the requested area.
                2. Mention things like: Are there usually paid lots? Is it crowded? Are there nearby malls or metro stations where they should park instead? 
                3. Keep your response helpful, friendly, and concise (max 2 short paragraphs).
                
                (For context, here is the user's past booking history on our app just in case they ask: ${historyData})

                User's question: ${userMessage}
            `;

            // 👇 CHANGED TO gemini-pro TO FIX YOUR 404 CRASH 👇
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const result = await model.generateContent(systemPrompt);
            const botResponse = await result.response.text(); // Added 'await' just to be safe

            setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
        } catch (error) {
            console.error("AI Error:", error);

            // Pro-level error handling: Detect if the server is just busy
            if (error.message && (error.message.includes("503") || error.message.includes("high demand"))) {
                setMessages(prev => [...prev, { text: "Wow, a lot of people are asking me for parking advice right now! 🚦 Give me 5 seconds and try asking again.", isBot: true }]);
            } else {
                setMessages(prev => [...prev, { text: "Oops! My AI brain is having a hiccup. Check your connection and try again!", isBot: true }]);
            }
        } finally {
            setIsLoading(false);
        }1
    };

    return (
        <div className="AIAssistantWrapper">
            <button className={`AIFab ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '✖' : '✨'}
            </button>

            {isOpen && (
                <div className="AIChatWindow">
                    <div className="AIChatHeader">
                        <h3>Parkly AI Assistant</h3>
                        <p>Powered by Gemini</p>
                    </div>

                    <div className="AIChatBody">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`MessageRow ${msg.isBot ? 'BotRow' : 'UserRow'}`}>
                                <div className={`MessageBubble ${msg.isBot ? 'BotMsg' : 'UserMsg'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="MessageRow BotRow">
                                <div className="MessageBubble BotMsg TypingIndicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="AIChatInputArea" onSubmit={handleSend}>
                        <input
                            type="text"
                            placeholder="Ask about a location..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()}>
                            ➤
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AIAssistant;