'use client';
import { useState } from 'react';

export default function Home() {
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
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

            const data = await res.text();
            setResponse(data);
        } catch (error) {
            console.error('Error:', error);
            setResponse('An error occurred while fetching the response.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <div className="flex gap-4 items-center flex-col sm:flex-row">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors px-4 sm:px-5 text-sm sm:text-base h-10 sm:h-12 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 min-w-[300px]"
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

                {response && (
                    <div className="mt-4 p-4 rounded-lg border border-solid border-black/[.08] dark:border-white/[.145]">
                        <pre className="whitespace-pre-wrap">{response}</pre>
                    </div>
                )}
            </main>
        </div>
    );
}