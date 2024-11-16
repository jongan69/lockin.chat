// route.ts
export async function GET(
    request: Request
) {
    // const marketCode = request.nextUrl.searchParams.get('marketCode');
    const marketCode = 'LOCKIN-USD-SWAP-LIN';
    const timeframe = '3600s';
    const limit = 100;
    const startTime = Date.now() - 1000 * 60 * 60 * 24 * 7;
    const endTime = Date.now();
    const url = `https://api.ox.fun/v3/candles?marketCode=${marketCode}&timeframe=${timeframe}&limit=${limit}&startTime=${startTime}&endTime=${endTime}`;

    try {
        const response = await fetch(url, { cache: 'no-store' })
            .then(res => res.json())
        // console.log(response)

        const { rsi, lsi } = calculateIndicators(response.data.reverse());
        // console.log(rsiValues);

        return Response.json({ candles: response.data, rsi, lsi });
    } catch (error: any) {
        console.error(`Error fetching price data: ${error}`);
        return Response.json({ error: 'failed to load data' })
    }
}

function calculateIndicators(candles: Array<{ close: string, volume: string }>, period: number = 14) {
    const closingPrices = candles.map(candle => parseFloat(candle.close));
    const volumes = candles.map(candle => parseFloat(candle.volume));
    const rsi: number[] = [];
    const lsi: number[] = [];
    let gains = 0;
    let losses = 0;

    // Initial average gain and loss
    for (let i = 1; i <= period; i++) {
        const change = closingPrices[i] - closingPrices[i - 1];
        if (change > 0) {
            gains += change;
        } else {
            losses -= change; // losses are positive
        }
    }

    let averageGain = gains / period;
    let averageLoss = losses / period;

    // Calculate RSI for the first period
    rsi.push(100 - (100 / (1 + (averageGain / averageLoss))));

    // Calculate RSI and LSI for the rest of the data
    for (let i = period + 1; i < closingPrices.length; i++) {
        const change = closingPrices[i] - closingPrices[i - 1];
        if (change > 0) {
            gains = change;
            losses = 0;
        } else {
            gains = 0;
            losses = -change;
        }

        averageGain = ((averageGain * (period - 1)) + gains) / period;
        averageLoss = ((averageLoss * (period - 1)) + losses) / period;

        const rs = averageGain / averageLoss;
        const currentRSI = 100 - (100 / (1 + rs));
        rsi.push(currentRSI);

        // Calculate LSI
        const volWeight = volumes[i] / (volumes.slice(i - period, i).reduce((a, b) => a + b, 0) / period);
        const currentLSI = currentRSI * volWeight;
        lsi.push(currentLSI);
    }

    return { rsi, lsi };
}