'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

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

    const handleSubmit = async () => {
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
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-4xl">
                {conversations.map((conv, index) => (
                    <div key={index} className="w-full space-y-4">
                        <div className="flex justify-end">
                            <div className="p-4 rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] bg-black/[.02] dark:bg-white/[.02] max-w-[80%]">
                                <p className="font-medium">{conv.question}</p>
                            </div>
                        </div>
                        <div className="flex w-full pr-[88px]">
                            <div className="p-4 rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] w-full prose dark:prose-invert max-w-none">
                                <ReactMarkdown>{conv.answer}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flex gap-4 items-center flex-col sm:flex-row w-full">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors px-4 sm:px-5 text-sm sm:text-base h-10 sm:h-12 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 flex-1 text-black"
                        placeholder="Enter your question..."
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                    >
                        {isLoading ? 'Loading...' : 'Ask'}
                    </button>
                </div>
            </main>
        </div>
    );
}