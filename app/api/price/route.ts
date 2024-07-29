// route.ts
export async function GET(
    request: Request
) {

    const url = `https://price.jup.ag/v6/price?ids=LOCKIN`;

    try {
        const response = await fetch(url)
            .then(res => res.json())
        // console.log(response)
        const price = response.data.LOCKIN.price;

        return Response.json({ price, uiFormmatted: `$${price.toFixed(3)}`});
    } catch (error: any) {
        console.error(`Error fetching price data: ${error}`);
        return Response.json({ error: 'failed to load data' })
    }
}