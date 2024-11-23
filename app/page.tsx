'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Image from "next/image";

interface Conversation {
    question: string;
    answer: string;
}

interface ApiResponse {
    answer: {
        role: string;
        parts: {
            text: string;
        }[];
    };
}

export default function Home() {
    const [question, setQuestion] = useState('');
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent the default form submission behavior
        if (!question.trim()) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "question": question
                })
            });

            const data: ApiResponse = await res.json();
            setConversations(prev => [...prev, {
                question: question,
                answer: data.answer.parts[0].text
            }]);
            setQuestion('');
        } catch (error) {
            console.error('Error:', error);
            setConversations(prev => [...prev, {
                question: question,
                answer: 'An error occurred while fetching the response.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-[#1A1A1A] text-white">
            <Image
                src="/solanswer.png"
                width={500}
                height={500}
                alt="Solanswer Logo"
            />
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-4xl">
                {conversations.map((conv, index) => (
                    <div key={index} className="w-full space-y-4">
                        <div className="flex justify-end">
                            <div className="p-4 rounded-lg border border-solid border-[#9945FF] bg-[#121212] max-w-[80%]">
                                <p className="font-medium">{conv.question}</p>
                            </div>
                        </div>
                        <div className="flex w-full pr-[88px]">
                            <div className="p-4 rounded-lg border border-solid border-[#14F195] w-full prose dark:prose-invert max-w-none bg-[#121212]">
                                <ReactMarkdown>{conv.answer}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}

                <form onSubmit={handleSubmit} className="flex gap-4 items-center flex-col sm:flex-row w-full">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="rounded-full border border-solid border-[#9945FF] transition-colors px-4 sm:px-5 text-sm sm:text-base h-10 sm:h-12 focus:outline-none focus:ring-2 focus:ring-[#00FFA3] flex-1 bg-[#2B2B2B] text-white"
                        placeholder="Enter your question..."
                    />
                    <button
                        type="submit" // Ensure the button submits the form
                        disabled={isLoading}
                        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-[#00FFA3] text-[#121212] gap-2 hover:bg-[#00E09B] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                    >
                        {isLoading ? 'Loading...' : 'Ask'}
                    </button>
                </form>
            </main>
        </div>
    );
}