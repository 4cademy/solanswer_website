export async function POST(request: Request) {
    const data = await request.json();

    const response = await fetch('https://solana-chat-60707405365.us-central1.run.app', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    const result = await response.text();
    return new Response(result);
}