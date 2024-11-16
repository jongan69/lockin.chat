if (!process.env.API_BASE_URL) {
    throw new Error("API_BASE_URL is not set");
}

export async function getMessages() {
    const apiUrl = `${process.env.API_BASE_URL}/api/messages`;
    console.log(apiUrl);
    const response = await fetch(apiUrl);
    return response.json();
}