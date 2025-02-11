// route.ts
export async function GET() {
    const latestUrl = `https://api.dexscreener.com/latest/dex/tokens/8Ki8DpuWNxu9VsS3kQbarsCWMcFGWkzzA8pUPto9zBd5`;
    const pairUrl = `https://io.dexscreener.com/dex/pair-details/v3/solana/8Ki8DpuWNxu9VsS3kQbarsCWMcFGWkzzA8pUPto9zBd5`;

    try {
        const [latestData, pairData] = await Promise.all([
            fetch(latestUrl).then(res => res.json()),
            fetch(pairUrl).then(res => res.json())
        ]);

        const maxSupply = pairData.cg.maxSupply;
        const totalSupply = pairData.cg.totalSupply;
        const circulatingSupply = pairData.cg.circulatingSupply;
        const fdv = latestData.pairs[0].fdv;
        const marketCap = latestData.pairs[0].marketCap;

        // console.log(`High 24h: ${high24h}, Low 24h: ${low24h}, Volume 24h: ${volume24h}, Currency Volume 24h: ${currencyVolume24h}, Open Interest: ${openInterest}`);
        return Response.json({ maxSupply, totalSupply, circulatingSupply, fdv, marketCap });
    } catch (error: any) {
        console.error(`Error fetching dexscreener data: ${error}`);
        return Response.json({ error: 'failed to load data' })
    }
}