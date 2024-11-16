if (!process.env.API_BASE_URL) {
    throw new Error("API_BASE_URL is not set");
}

export async function saveMessage(message: string, role: string) {
    const apiUrl = `${process.env.API_BASE_URL}/api/messages`;
    console.log(apiUrl);
    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message, role: role })
    });
}