// route.ts
export async function GET(
    request: Request
) {

    const address = "8Ki8DpuWNxu9VsS3kQbarsCWMcFGWkzzA8pUPto9zBd5";
    const url = `https://api.jup.ag/price/v2?ids=${address}&showExtraInfo=true`;

    try {
        const response = await fetch(url)
            .then(res => res.json())
        // console.log(response)
        const price = response.data[address].price;
        const numberPrice = Number(price);
        // console.log(`Data: ${JSON.stringify(response)}`);
        if (price && numberPrice) {
            // console.log(`UI Formatted: $${numberPrice.toFixed(6)}`);
            return Response.json({ price, uiFormmatted: `$${numberPrice.toFixed(6)}`});
        } else {
            console.log(`No price data available`);
            return Response.json({ price: 0, uiFormmatted: `$${0}`});
        }
    } catch (error: any) {
        console.error(`Error fetching jupiter price data: ${error}`);
        return Response.json({ error: 'failed to load data' })
    }
}