"use client";
import React, { Suspense, useEffect, useState } from 'react';
import { Container } from './styles';
import Image from 'next/image';
import Button from '../Button/index.js';
import variables from '../../variables';
import Header from '../Header';
import { Canvas } from '@react-three/fiber';
import RainingLockersBackground from '../Three/RainingLockins';
import { translations } from './translations';
import LanguageSelector from './LanguageSelector';
import MessengerButton from '../MessengerButton';
import RSIChart from '../RSIChart';
import PrisonProgressBar from '../PrisonProgressBar';
import BotTradingInfo from '../BotTradingInfo';
import { isWebGLAvailable } from '../../utils/checkWebGL';

const trading = require('../../images/trade.svg');
const bonkLogo = require('../../images/bonk.svg');
const dexLogo = require('../../images/dexscreener.png');
const moonLogo = require('../../images/moon.svg');
const rayLogo = require('../../images/raydium.svg');
const logo = require('../../images/logo.svg');
const phantomLogo = require('../../images/phantom.svg');
const bagsLogo = require('../../images/bags.jpg');
const twitterLogo = require('../../images/twitter.svg');
const autosnipeLogo = require('../../images/autosnipe.png');
const photonLogo = require('../../images/photon.jpg');
const wtf = require('../../images/wtf.svg');
const h = 20;
const CA = '8Ki8DpuWNxu9VsS3kQbarsCWMcFGWkzzA8pUPto9zBd5';

function formatNumberWithSuffix(number) {
  if (number === undefined || number === null) {
    return 'N/A';
  }

  const num = parseFloat(number);
  if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B';
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K';
  }
  return num.toFixed(2);
}

function getLargerNumber(num1, num2) {
  return num1 > num2 ? num1 : num2;
}

export default function LinkTree() {
  const [webGLAvailable, setWebGLAvailable] = useState(false);
  const [juppricedata, setJupPriceData] = useState();
  const [oxtickerdata, setOxTickerData] = useState();
  const [oxpricedata, setOxPriceData] = useState();
  const [oxcandleresponse, setOxCandleResponse] = useState();
  const [holderdata, setHolderData] = useState();
  const [holderscan, setHolderScan] = useState();
  const [totalholders, setTotalHolders] = useState();
  const [language, setLanguage] = useState('en');
  const [promptData, setPromptData] = useState();
  const [currentRsi, setCurrentRsi] = useState();
  const [currentLsi, setCurrentLsi] = useState();
  const [rsiData, setRsiData] = useState([]);
  const [rsiLabels, setRsiLabels] = useState([]);
  const [lsiData, setLsiData] = useState([]);
  const [dexscreenerdata, setDexScreenerData] = useState();
  const oversoldThreshold = 40;
  const [currentPNL, setCurrentPNL] = useState(0);
  const largestPrisonPopulation = 28500;

  useEffect(() => {
    setWebGLAvailable(isWebGLAvailable());
  }, []);

  async function fetchData() {
    try {
      const [
        pricedata,
        oxtickerdata,
        oxpricedata,
        heliusholderdata,
        holderscandata,
        oxcandleresponse,
        dexscreenerresponse
      ] = await Promise.all([
        fetch('/api/price', { cache: 'no-store' }).then(res => res.json()),
        fetch('/api/oxtickerdata', { cache: 'no-store' }).then(res => res.json()),
        fetch('/api/oxpricedata', { cache: 'no-store' }).then(res => res.json()),
        fetch('/api/heliusmarketdata', { cache: 'no-store' }).then(res => res.json()),
        fetch('/api/holderscan', { cache: 'no-store' }).then(res => res.json()),
        fetch('/api/oxcandledata', { cache: 'no-store' }).then(res => res.json()),
        fetch('/api/dexscreener', { cache: 'no-store' }).then(res => res.json())
      ]);

      setJupPriceData(pricedata);
      setOxTickerData(oxtickerdata);
      setOxPriceData(oxpricedata);
      setHolderData(heliusholderdata);
      setHolderScan(holderscandata);
      setDexScreenerData(dexscreenerresponse);
      if (oxcandleresponse) {
        setOxCandleResponse(oxcandleresponse);
        setCurrentRsi(oxcandleresponse?.rsi[oxcandleresponse?.rsi?.length - 1]);
        setCurrentLsi(oxcandleresponse?.lsi[oxcandleresponse?.lsi?.length - 1]);
        setRsiData(oxcandleresponse?.rsi);
        setLsiData(oxcandleresponse?.lsi);
        setCurrentPNL(oxcandleresponse?.trading?.pnl);
        const labels = oxcandleresponse?.candles?.map(candle => {
          const date = new Date(parseInt(candle.openedAt));
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
          return `${month}/${day}/${year}`;
        });
        setRsiLabels(labels);
      }

      if (holderscandata?.currentHolders) {
        setTotalHolders(holderscandata.currentHolders);
      } else if (heliusholderdata?.totalHolders) {
        setTotalHolders(heliusholderdata.totalHolders);
      }
      console.log('holderscandata', holderscandata);
      setPromptData({
        language: language || 'en',
        candledata: oxcandleresponse.candles,
        currentRsi: currentRsi,
        currentLsi: currentLsi,
        lsiDescription: "The standard RSI is calculated using a 14-period by default. Volume Weighting: If enabled, the LSI (Lockedin Strength Indictaor) modifies the RSI by weighting it based on the volume relative to its moving average. This emphasizes periods of high or low volume, which can be particularly useful for Solana-based assets that might have unique volume profiles.",
        oxfunurl: 'https://ox.fun/x/lockin',
        dexscreenerurl: `https://dexscreener.com/solana/${CA}`,
        moonshoturl: `https://moonshot.money/LOCKIN?ref=vtsmoh24uf`,
        raydiumurl: `https://raydium.io/swap/?inputMint=sol&outputMint=${CA}&referrer=9yA9LPCRv8p8V8ZvJVYErrVGWbwqAirotDTQ8evRxE5N`,
        phantomurl: `https://phantom.app/tokens/solana/${CA}?referralId=m0ezk5sfqrs`,
        bonkurl: `https://t.me/bonkbot_bot?start=ref_jyzn2_ca_${CA}`,
        price: pricedata?.price,
        totalHolders: totalholders,
        marketCap: holderscandata?.marketCap,
        supply: holderscandata?.supply,
        high24h: oxpricedata?.high24h,
        low24h: oxpricedata?.low24h,
        botTradingData: oxcandleresponse?.trading,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    } else {
      async function fetchLanguage() {
        const response = await fetch('/api/detectLanguage').then(data => data.json());
        setLanguage(response.language);
      }
      fetchLanguage();
    }
  }, []);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const translate = (key) => translations[language]?.[key] || translations.en[key];

  const isPriceClose = () => {
    if (!juppricedata || !oxpricedata) return false;
    const jupiterPrice = parseFloat(juppricedata.price);
    const oxLowPrice = parseFloat(oxpricedata.low24h);
    const threshold = oxLowPrice * 0.20;
    return Math.abs(jupiterPrice - oxLowPrice) <= threshold;
  };

  const isGoodEntry = () => {
    if (!rsiData?.length || !lsiData?.length) return false;
    const latestRSI = rsiData[rsiData.length - 1];
    const latestLSI = lsiData[lsiData.length - 1];
    return latestRSI < oversoldThreshold && latestLSI < oversoldThreshold;
  };

  return (
    <Suspense fallback={<h2>🌀 Loading...</h2>}>
      <Container>
        <LanguageSelector currentLanguage={language} onChangeLanguage={handleLanguageChange} />
        <br />
        <div className='text-center text-xl bg-slate-800 p-4 mb-4 rounded'>
          <Header
            picture="profile.png"
            title={translate('title')}
            subtitle={translate('subtitle')}
          />
          {/* <p>{JSON.stringify(oxcandleresponse) || 'N/A'}</p> */}
          <br />
          <p>{translate('totalLockers')}: {totalholders?.toLocaleString() || 'N/A'}</p>
          <p>{translate('totalJeets')}: {holderdata?.RetardedAssJeetFaggots.toLocaleString() || 'N/A'}</p>
          <p>{translate('marketCap')}: ${formatNumberWithSuffix(dexscreenerdata?.marketCap) || 'N/A'}</p>
          <p>{translate('supply')}: {formatNumberWithSuffix(dexscreenerdata?.circulatingSupply)} LOCKINS</p>
          <p>{translate('fullyDilutedValue')}: ${formatNumberWithSuffix(dexscreenerdata?.fdv)}</p>
          <br />
          <p>{translate('jupiterPrice')}: {juppricedata?.uiFormmatted || 'N/A'}</p>
          <p>{translate('oxPrice')}: {oxtickerdata?.uiFormmatted || 'N/A'}</p>
          <p>{translate('oxHigh')}: {oxpricedata?.high24h || 'N/A'}</p>
          <p>{translate('oxLow')}: {oxpricedata?.low24h || 'N/A'}</p>
          <br />

          {isPriceClose() && (
            <p className='text-center' style={{ color: 'green', fontWeight: 'bold' }}>
              LOCK IN LOOKS GREAT
            </p>
          )}

          <br />
          {rsiLabels?.length > 0 && rsiData?.length > 0 && lsiData?.length > 0 && <RSIChart rsiLabels={rsiLabels} rsiData={rsiData} lsiData={lsiData} />}
          <br />
          <p>RSI: {currentRsi || 'N/A'}</p>
          <p>LSI: {currentLsi || 'N/A'}</p>
          <br />

          <br />
          {isGoodEntry() && (
            <>
              <p className='text-center' style={{ color: 'blue', fontWeight: 'bold' }}>
                {translate('goodEntryPoint')}
              </p>
            </>
          )}

          <br />

          {oxcandleresponse?.trading?.positions.length > 0 &&
            <BotTradingInfo
              pnl={currentPNL}
              positions={oxcandleresponse?.trading?.positions}
              translate={translate}
            />
          }

          {totalholders && <PrisonProgressBar
            totalHolders={totalholders}
            largestPrisonPopulation={largestPrisonPopulation}
            translate={translate}
          />
          }
          <br />

          <Button
            link='https://www.lockinsol.com/'
            icon={<Image src={logo} alt="Official Site" height={h} />}
            name={translate('buttonOfficialSite')}
            backgroundcolor={variables.discordColor}
          />
          <Button
            link={`https://phantom.app/tokens/solana/${CA}?referralId=m0ezk5sfqrs`}
            icon={<Image src={phantomLogo} alt="Phantom" height={h} />}
            name=''
            backgroundcolor={variables.discordColor}
          />
          <Button
            link='https://moonshot.money/LOCKIN?ref=vtsmoh24uf'
            icon={<Image src={moonLogo} height={h} alt="Moonshot" />}
            name={translate('buttonMoonshot')}
            backgroundcolor={variables.discordColor}
          />
          {/* <Button
            link={`https://dexscreener.com/solana/${CA}`}
            icon={<Image src={dexLogo} height={h} alt="DexScreener" />}
            name={translate('buttonDexScreener')}
            backgroundcolor={variables.discordColor}
          /> */}
          <Button
            link={`https://raydium.io/swap/?inputMint=sol&outputMint=${CA}&referrer=9yA9LPCRv8p8V8ZvJVYErrVGWbwqAirotDTQ8evRxE5N`}
            icon={<Image src={rayLogo} height={h} alt="Raydium" />}
            name={translate('buttonRaydium')}
            backgroundcolor={variables.discordColor}
          />
          <Button
            link='https://ox.fun/en/markets/LOCKIN-USD-SWAP-LIN?shareAccountId=lockin'
            icon={<Image src={trading} alt="OX" height={h} />}
            name={translate('buttonLockinPerps')}
            backgroundcolor={variables.discordColor}
          />
          <Button link={`https://bags.fm/b/$LOCK`} icon={<Image src={bagsLogo} height={h} alt="Bags" />} name='Bags' backgroundcolor={variables.whatsappColor} />
          <Button link={`https://x.com/i/communities/1829212924977570199`} icon={<Image src={twitterLogo} height={h} alt="Twitter" />} name='Twitter' backgroundcolor={variables.twitterColor} />
          <Button link={`https://autosnipe.ai/details/${CA}/?referral_code=lockin`} icon={<Image src={autosnipeLogo} alt="Autosnipe" height={h} />} name='Autosnipe' backgroundcolor={variables.whatsappColor} />
          <Button link={`https://photon-sol.tinyastro.io/en/r/@jongan69/${CA}`} icon={<Image src={photonLogo} alt="Photon" height={h} />} name='Photon' backgroundcolor={variables.whatsappColor} />

          <Button
            link={`https://t.me/bonkbot_bot?start=ref_jyzn2_ca_${CA}`}
            icon={<Image src={bonkLogo} alt="Bonk" height={h} />}
            name={translate('buttonBonkBuy')}
            backgroundcolor={variables.discordColor}
          />

          <Button
            link={`https://t.me/Lockinvideouploader_bot`}
            icon={<Image src={wtf} alt="Lockin Tiktok Uploader Bot" height={h} />}
            name={'Lockin Tiktok Bot'}
            backgroundcolor={variables.discordColor}
          />

          <Button
            link={`https://t.me/USDC2BTC_bot`}
            icon={<Image src={wtf} alt="USDC2BTC" height={h} />}
            name={'USDC2BTC Bot'}
            backgroundcolor={variables.discordColor}
          />


          <Button
            link='https://lock.wtf'
            icon={<Image src={wtf} alt="WTF" height={h} />}
            name={translate('buttonLockWTF')}
            backgroundcolor={variables.discordColor}
          />
        </div>
        <br />
        <MessengerButton promptData={promptData} />
        <br />
        {webGLAvailable && <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
          <Canvas>
            <RainingLockersBackground holders={holderscan?.marketCapOverHolders ?? 10} />
          </Canvas>
        </div>}
      </Container>
    </Suspense>
  );
}
