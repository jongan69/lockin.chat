// route.ts
import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

const marketCode = 'LOCKIN-USD-SWAP-LIN';
const timeframe = '3600s';

// Original function to calculate both RSI and LSI
function calculateIndicators(candles: Array<{ close: string, volume: string }>, period: number = 14) {
  console.log(`Starting indicator calculations with ${candles.length} candles and period ${period}`);
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
      losses -= change;
    }
  }

  let averageGain = gains / period;
  let averageLoss = losses / period;
  console.log(`Initial averages - Gain: ${averageGain}, Loss: ${averageLoss}`);

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

  console.log(`Calculated ${rsi.length} RSI values and ${lsi.length} LSI values`);
  console.log(`Latest RSI: ${rsi[rsi.length-1]}, Latest LSI: ${lsi[lsi.length-1]}`);
  return { rsi, lsi };
}

// Add authentication helper function
function generateAuthHeaders(method: string, path: string, body: string = '') {
  console.log(`Generating auth headers for ${method} request to ${path}`);
  const timestamp = new Date().toISOString();
  const nonce = Date.now().toString();
  const restPath = 'api.ox.fun';
  
  const msgString = `${timestamp}\n${nonce}\n${method}\n${restPath}\n${path}\n${body}`;
  console.log('Auth message string:', msgString);
  
  // Generate HMAC SHA256 signature using API SECRET
  const signature = createHmac('sha256', process.env.OX_API_SECRET || '')
    .update(msgString)
    .digest('base64');

  const headers = {
    'Content-Type': 'application/json',
    'AccessKey': process.env.OX_API_KEY || '',
    'Timestamp': timestamp,
    'Signature': signature,
    'Nonce': nonce
  };
  
  console.log('Generated headers:', { ...headers, Signature: '***hidden***' });
  return headers;
}

// Update getCurrentPositions function to get both working orders and open positions
async function getCurrentPositions() {
  try {
    // Get working orders
    const ordersPath = '/v3/orders/working';
    const ordersHeaders = generateAuthHeaders('GET', ordersPath);
    
    // Get open positions
    const positionsPath = '/v3/positions';
    const positionsHeaders = generateAuthHeaders('GET', positionsPath);
    
    const [ordersResponse, positionsResponse] = await Promise.all([
      fetch(`https://api.ox.fun${ordersPath}`, {
        method: 'GET',
        headers: ordersHeaders
      }),
      fetch(`https://api.ox.fun${positionsPath}`, {
        method: 'GET',
        headers: positionsHeaders
      })
    ]);

    console.log('Orders response status:', ordersResponse.status);
    console.log('Positions response status:', positionsResponse.status);
    
    const ordersText = await ordersResponse.text();
    const positionsText = await positionsResponse.text();

    let workingOrders = [];
    let openPositions = [];

    if (ordersText) {
      const ordersData = JSON.parse(ordersText);
      workingOrders = ordersData.success ? ordersData.data : [];
    }

    if (positionsText) {
      const positionsData = JSON.parse(positionsText);
      openPositions = positionsData.success ? positionsData.data : [];
    }

    return {
      workingOrders,
      openPositions
    };
  } catch (error) {
    console.error('Error fetching positions:', error);
    return {
      workingOrders: [],
      openPositions: []
    };
  }
}

// Update placeOrder function
async function placeOrder(side: 'BUY' | 'SELL', quantity: string, price: string) {
  console.log(`Placing ${side} order for ${quantity} at price ${price}`);
  const path = '/v3/orders/place';
  const body = JSON.stringify({
    recvWindow: 20000,
    responseType: 'FULL',
    timestamp: Date.now(),
    orders: [{
      clientOrderId: Date.now(),
      marketCode: marketCode,
      side,
      quantity,
      timeInForce: 'GTC',
      orderType: 'LIMIT',
      price
    }]
  });

  const headers = generateAuthHeaders('POST', path, body);

  console.log('Order request body:', body);
  
  try {
    const response = await fetch(`https://api.ox.fun${path}`, {
      method: 'POST',
      headers,
      body
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Order error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const responseData = await response.json();
    console.log('Order response:', JSON.stringify(responseData, null, 2));
    return responseData;
    
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
}

// Update the calculatePNL function to handle both working orders and open positions
async function calculatePNL(positions: any[], currentPrice: number) {
  console.log('Calculating PNL with current price:', currentPrice);
  let totalPNLUSD = 0;
  let totalPNLOX = 0;

  try {
    const oxPriceResponse = await fetch('https://api.ox.fun/v3/tickers?marketCode=OX-USD-SWAP-LIN');
    const oxPriceData = await oxPriceResponse.json();
    const oxUsdPrice = parseFloat(oxPriceData.data[0]?.markPrice || '0');
    
    console.log('OX-USD Price:', oxUsdPrice);

    for (const positionWrapper of positions) {
      try {
        const positionsArray = positionWrapper.positions || [positionWrapper];
        
        for (const position of positionsArray) {
          if (position.positionPnl) {
            const pnlInOX = parseFloat(position.positionPnl);
            const pnlInUSD = pnlInOX * oxUsdPrice;
            
            totalPNLOX += pnlInOX;
            totalPNLUSD += pnlInUSD;
            
            console.log('PNL Calculation:', {
              pnlInOX,
              oxUsdPrice,
              pnlInUSD
            });
          }
        }
      } catch (error) {
        console.error('Error calculating PNL for position:', positionWrapper, error);
      }
    }
  } catch (error) {
    console.error('Error fetching OX-USD price:', error);
  }

  console.log('Calculated PNL:', {
    USD: totalPNLUSD,
    OX: totalPNLOX
  });

  return {
    usd: {
      amount: totalPNLUSD,
      currency: 'USD'
    },
    ox: {
      amount: totalPNLOX,
      currency: 'OX'
    }
  };
}

// Modify the GET endpoint
export async function GET(request: Request) {
  console.log('Starting GET request processing');
  const limit = 100;
  const startTime = Date.now() - 1000 * 60 * 60 * 24 * 7;
  const endTime = Date.now();
  
  console.log(`Fetching candles from ${new Date(startTime)} to ${new Date(endTime)}`);
  const url = `https://api.ox.fun/v3/candles?marketCode=${marketCode}&timeframe=${timeframe}&limit=${limit}&startTime=${startTime}&endTime=${endTime}`;

  try {
    const response = await fetch(url)
      .then(res => res.json());

    console.log(`Received ${response.data.length} candles from API`);
    const candles = response.data.reverse();
    
    const { rsi, lsi } = calculateIndicators(candles);
    const positions = await getCurrentPositions();
    console.log('Current positions:', positions);
    
    // Trading logic
    const currentRSI = rsi[rsi.length - 1];
    const currentLSI = lsi[lsi.length - 1];
    const currentPrice = parseFloat(candles[candles.length - 1].close);
    
    console.log('Current metrics:', {
      price: currentPrice,
      RSI: currentRSI,
      LSI: currentLSI
    });

    const OVERSOLD_THRESHOLD = 30;
    const OVERBOUGHT_THRESHOLD = 70;
    const LSI_MULTIPLIER = 1.5;
    const TRADE_QUANTITY = '10';
    
    let orderResult = null;
    
    // Enhanced trading logic using both RSI and LSI
    const weightedRSI = (currentRSI + (currentLSI * LSI_MULTIPLIER)) / (1 + LSI_MULTIPLIER);
    console.log(`Weighted RSI: ${weightedRSI}`);
    
    // Only trade if we don't have existing working orders or open positions
    if (positions.workingOrders.length === 0 && positions.openPositions.length === 0) {
      console.log(`Checking trade conditions - Weighted RSI: ${weightedRSI}`);
      if (weightedRSI < OVERSOLD_THRESHOLD) {
        console.log('Placing buy order');
        orderResult = await placeOrder(
          'BUY',
          TRADE_QUANTITY,
          currentPrice.toString()
        );
      } else if (weightedRSI > OVERBOUGHT_THRESHOLD) {
        console.log('Placing sell order');
        orderResult = await placeOrder(
          'SELL',
          TRADE_QUANTITY,
          currentPrice.toString()
        );
      }
    } else {
      console.log(`Skipping trade - ${positions.workingOrders.length} working orders and ${positions.openPositions.length} open positions`);
    }

    // Get updated positions after potential new trade
    const updatedPositions = await getCurrentPositions();
    console.log('Updated positions after trading:', updatedPositions);

    // Calculate current PNL using all positions
    const currentPNL = await calculatePNL([
      ...updatedPositions.workingOrders,
      ...updatedPositions.openPositions
    ], currentPrice);

    // Return the response with separate working orders and open positions
    return Response.json({
      candles: candles.map((candle: any) => ({
        ...candle,
        openedAt: candle.timestamp || candle.openedAt
      })),
      rsi: rsi,
      lsi: lsi,
      trading: {
        currentPrice,
        currentRSI,
        currentLSI,
        weightedRSI,
        orderResult,
        positions: {
          workingOrders: updatedPositions.workingOrders,
          openPositions: updatedPositions.openPositions
        },
        pnl: currentPNL
      }
    });

  } catch (error: any) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return Response.json({ 
      error: 'failed to load data',
      details: error.message,
      candles: [],
      rsi: [],
      lsi: []
    });
  }
}