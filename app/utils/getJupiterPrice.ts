export async function getJupiterPrice() {
    try {
        const address = "8Ki8DpuWNxu9VsS3kQbarsCWMcFGWkzzA8pUPto9zBd5";
        const url = `https://api.jup.ag/price/v2?ids=${address}&showExtraInfo=true`;


        const response = await fetch(url, { cache: 'no-store' })
            .then(res => res.json())
        // console.log(response)
        const price = response.data[address].price;
        const numberPrice = Number(price);
        // console.log(`Data: ${JSON.stringify(response)}`);
        if (price && numberPrice) {
            // console.log(`UI Formatted: $${numberPrice.toFixed(6)}`);
            return { price, uiFormmatted: `$${numberPrice.toFixed(6)}` };
        } else {
            console.log(`No price data available`);
            return { price: 0, uiFormmatted: `$${0}` };
        }

    } catch (error: any) {
        console.error(`Error fetching price data: ${error}`);
        return { price: 0, uiFormmatted: `$${0}` };
    }
}