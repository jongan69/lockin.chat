// route.ts
export async function GET(
    request: Request
) {

    const url = `https://api.ox.fun/v3/markets?marketCode=LOCKIN-USD-SWAP-LIN`;

    try {
        const response = await fetch(url, { cache: 'no-store' })
            .then(res => res.json())
        // console.log(response)
        
        const upperprice = response.data[0].upperPriceBound;
        const lowerprice = response.data[0].lowerPriceBound;
        const marketprice = response.data[0].markPrice;

        return Response.json({ upperprice, lowerprice, marketprice });
    } catch (error: any) {
        console.error(`Error fetching price data: ${error}`);
        return Response.json({ error: 'failed to load data' })
    }
}