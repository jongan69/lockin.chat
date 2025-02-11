// route.ts
export async function GET(
    request: Request
) {

    const url = `https://api.ox.fun/v3/markets?marketCode=LOCKIN-USD-SWAP-LIN`;

    try {
        const response = await fetch(url)
            .then(res => res.json())        
        // console.log(response)
        const upperprice = Number(response.data[0].upperPriceBound);
        const lowerprice = Number(response.data[0].lowerPriceBound);
        const marketprice = Number(response.data[0].markPrice);

        return Response.json({ upperprice, lowerprice, marketprice, uiFormmatted: `$${marketprice.toFixed(6)}`});
    } catch (error: any) {
        console.error(`Error fetching oxtickerdata data: ${error}`);
        return Response.json({ error: 'failed to load data' })
    }
}