// route.ts
export async function GET(
    request: Request
) {
    const url = `https://holderscan.com/api/tokens/tokens/meta?ca=8Ki8DpuWNxu9VsS3kQbarsCWMcFGWkzzA8pUPto9zBd5`;
    try {
        const response = await fetch(url)
            .then(res => res.json())

        const currentHolders = response.data?.currentHolders;
        const totalUniqueWallets = response.data?.totalUniqueWallets;
        const totalSellers = totalUniqueWallets - currentHolders;
        const supply = response.data?.supply;
        const marketCap = response.data?.marketCap;
        const marketCapOverHolders = response?.data?.marketCapOverHolders;
        const holdersOver10USD = response?.data?.holdersOver10USD;
        return Response.json({ currentHolders, supply, marketCap, marketCapOverHolders, holdersOver10USD, totalSellers });
    } catch (error: any) {
        console.error(`Error fetching price data: ${error}`);
        return Response.json({ error: 'failed to load data' })
    }
}