"use client";
import React, { Suspense, useEffect, useState } from 'react';
import { Container } from './styles';
import Image from 'next/image';
import Button from '../Button/index.js';
import variables from '../../variables';
import Header from '../Header';
import { Canvas } from '@react-three/fiber';
import RainingLockersBackground from '../Three/RainingLockins';

// Logos
const trading = require('../../images/trade.svg');
const bonkLogo = require('../../images/bonk.svg');
const dexLogo = require('../../images/dexscreener.png');
const moonLogo = require('../../images/moon.svg');
const rayLogo = require('../../images/raydium.svg');
const logo = require('../../images/logo.svg');
const phantomLogo = require('../../images/phantom.svg');
const wtf = require('../../images/wtf.svg');

function formatNumberWithSuffix(number) {
  if (number === undefined || number === null) {
    return 'N/A';
  }
  
  const num = parseFloat(number); // Ensure the number is parsed correctly

  // Adjust the logic to handle very large numbers
  if (num >= 1e15) {
    return (num / 1e15).toFixed(2) + 'M'; // Trillions
  } else if (num >= 1e12) {
    return (num / 1e12).toFixed(2) + 'K'; // Billions
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + ''; // Millions
  } else if (num >= 1e6) {
    return (num / 1e3).toFixed(2) + ''; // Thousands
  }
  return num.toFixed(2);
}

export default function LinkTree() {
  const [juppricedata, setJupPriceData] = useState();
  // const [oxtickerdata, setOxTickerData] = useState();
  // const [oxpricedata, setOxPriceData] = useState();
  const [holderdata, setHolderData] = useState();
  const [holderscan, setHolderScan] = useState();

  async function fetchData() {
    const pricedata1 = await fetch('/api/price', { cache: 'no-store' }).then(data => data.json());
    // const oxtickerdata1 = await fetch('/api/oxtickerdata', { cache: 'no-store' }).then(data => data.json());
    // const oxpricedata1 = await fetch('/api/oxpricedata', { cache: 'no-store' }).then(data => data.json());
    const heliusholderdata = await fetch('/api/heliusmarketdata', { cache: 'no-store' }).then(data => data.json());
    const holderscandata = await fetch('/api/holderscan', { cache: 'no-store' }).then(data => data.json());
    
    setJupPriceData(pricedata1);
    // setOxTickerData(oxtickerdata1);
    // setOxPriceData(oxpricedata1);
    setHolderData(heliusholderdata);
    setHolderScan(holderscandata);
  }

  useEffect(() => {
    fetchData(); // Fetch initially

    const intervalId = setInterval(fetchData, 60000); // Polling every 60 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  const h = 20;
  function Loading() {
    return <h2>🌀 Loading...</h2>;
  }

  return (
    <Suspense fallback={<Loading />}>
      <Container>
        <br />
        <div className='text-center text-xl bg-slate-800 p-4 mb-4 rounded'>
          <Header picture="profile.png" title='Lockin Chat' subtitle={'Its Time To Lock TF In 🔒'} />
          <p>Total Lockers: {holderscan?.currentHolders?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 'N/A'}</p>
          <p>Total Jeets: {holderdata?.RetardedAssJeetFaggots?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 'N/A'}</p>
          <p>Holders Over 10 USD: {holderscan?.holdersOver10USD?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 'N/A'}</p>
          <br/>
          <p>MarketCap: ${holderscan?.marketCap?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 'N/A'}</p>
          <br/>
          <p>Supply: {formatNumberWithSuffix(holderscan?.supply)} LOCKINS</p>          
          <br />
          <p className='text-right'>Jupiter Price: ${juppricedata?.price || 'N/A'}</p>
          {/* <p className='text-right'>OX Market Price: ${oxtickerdata?.marketprice}</p> */}
          <br />
          {/* <p>OX 24 Hour High: ${oxpricedata?.high24h}</p> */}
          <br />
          {/* <p>OX 24 Hour Low: ${oxpricedata?.low24h}</p> */}
          <br />
          {/* <p>OX 24 Hour Volume: {Number(oxpricedata?.volume24h).toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p> */}
          <br />
          {/* <p>OX Open Interest: {oxpricedata?.openInterest.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p> */}
        </div>
        <br />
        <Button link='https://www.lockinsol.com/' icon={<Image src={logo} alt="Official Site" height={h} />} name='Official Site' backgroundcolor={variables.discordColor} />
        <Button link='https://phantom.app/tokens/solana/8Ki8DpuWNxu9VsS3kQbarsCWMcFGWkzzA8pUPto9zBd5?referralId=m0ezk5sfqrs' icon={<Image src={phantomLogo} alt="Phantom" height={h} />} name='' backgroundcolor={variables.discordColor} />
        <Button link='https://moonshot.money/LOCKIN?ref=vtsmoh24uf' icon={<Image src={moonLogo} height={h} alt="Moonshot" />} name='Moonshot' backgroundcolor={variables.discordColor} />
        <Button link='https://dexscreener.com/solana/atwmaa6t9t8cq8xccccfpgdnnqyxhscunuy6wvri7fke' icon={<Image src={dexLogo} height={h} alt="DexScreener" />} name='DexScreener' backgroundcolor={variables.discordColor} />
        <Button link='https://raydium.io/swap/?inputMint=sol&outputMint=8Ki8DpuWNxu9VsS3kQbarsCWMcFGWkzzA8pUPto9zBd5&referrer=9yA9LPCRv8p8V8ZvJVYErrVGWbwqAirotDTQ8evRxE5N' icon={<Image src={rayLogo} height={h} alt="Raydium" />} name='Raydium' backgroundcolor={variables.discordColor} />
        <Button link='https://ox.fun/x/lockin' icon={<Image src={trading} alt="OX" height={h} />} name='Lockin Perps' backgroundcolor={variables.discordColor} />
        <Button link='https://t.me/bonkbot_bot?start=ref_jyzn2_ca_8Ki8DpuWNxu9VsS3kQbarsCWMcFGWkzzA8pUPto9zBd5' icon={<Image src={bonkLogo} alt="Bonk" height={h} />} name='Bonk Buy' backgroundcolor={variables.discordColor} />
        <Button link='https://lock.wtf' icon={<Image src={wtf} alt="OX" height={h} />} name='Lock.WTF' backgroundcolor={variables.discordColor} />
      </Container>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <Canvas>
          <RainingLockersBackground holders={holderdata?.totalHolders}/>
        </Canvas>
      </div>
    </Suspense>
  );
}
