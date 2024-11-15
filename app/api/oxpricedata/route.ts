// route.ts
export async function GET(
    request: Request
) {

    const url = `https://api.ox.fun/v3/tickers?marketCode=LOCKIN-USD-SWAP-LIN`;

    try {
        const response = await fetch(url, { cache: 'no-store' })
            .then(res => res.json())
        // console.log(response)
        
        const high24h = response.data[0].high24h;
        const low24h = response.data[0].low24h;
        const volume24h = response.data[0].volume24h;
        const currencyVolume24h = response.data[0].currencyVolume24h;
        const openInterest = response.data[0].openInterest;

        // console.log(`High 24h: ${high24h}, Low 24h: ${low24h}, Volume 24h: ${volume24h}, Currency Volume 24h: ${currencyVolume24h}, Open Interest: ${openInterest}`);
        return Response.json({ high24h, low24h, volume24h, currencyVolume24h, openInterest });
    } catch (error: any) {
        console.error(`Error fetching price data: ${error}`);
        return Response.json({ error: 'failed to load data' })
    }
}