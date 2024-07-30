"use client"
import React, { Suspense, useEffect, useState } from 'react';
import { Container } from './styles';
import Image from 'next/image'
import Button from '../Button/index.js';
import variables from '../../variables';
import Header from '../Header';

// Money
import { Canvas } from '@react-three/fiber';
import RainingLockersBackground from '../Three/RainingLockins'

// Logos
const trading = require('../../images/trade.svg');
const bonkLogo = require('../../images/bonk.svg');
const lockLogo = require('../../images/logo.svg');
const moonLogo = require('../../images/moon.svg');


export default function LinkTree() {
  const [juppricedata, setJupPriceData] = useState();
  const [oxtickerdata, setOxTickerData] = useState();
  const [oxpricedata, setOxPriceData] = useState();
  const [holderdata, setHolderData] = useState();
  const [holderscan, setHolderScan] = useState();

  async function fetchData() {
    const pricedata1 = await fetch('/api/price').then(data => data.json());
    const oxtickerdata1 = await fetch('/api/oxtickerdata').then(data => data.json());
    const oxpricedata1 = await fetch('/api/oxpricedata').then(data => data.json());
    const heliusholderdata = await fetch('/api/heliusmarketdata').then(data => data.json());
    const holderscandata = await fetch('/api/holderscan').then(data => data.json());
    setJupPriceData(pricedata1);
    setOxTickerData(oxtickerdata1);
    setOxPriceData(oxpricedata1);
    setHolderData(heliusholderdata);
    setHolderScan(holderscandata);
  }

  useEffect(() => {
    fetchData()
  }, []);

  const h = 20;
  function Loading() {
    return <h2>🌀 Loading...</h2>;
  }

  // Get Token price from Jupiter

  // Get Token Data from 
  return (
    <Suspense fallback={<Loading />}>
      <Container>
        
        <br />
        <div className='text-center text-xl bg-slate-800 p-4 mb-4 rounded'>
        <Header picture="profile.png" title='Lockin Chat' subtitle={'Its Time To Lock TF In 🔒'} />
          <p>Total Lockers: {holderscan?.currentHolders.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
          <p>Total Jeets: {holderdata?.RetardedAssJeetFaggots.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
          <p>Holders Over 10 USD: {holderscan?.holdersOver10USD.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
          <br/>
          <p>MarketCap: ${holderscan?.marketCap.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
          <br/>
          <p>Supply: {holderscan?.supply.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} LOCKINS</p>
          <br />
          <p>Jupiter Price: ${juppricedata?.price.toFixed(3)}</p>
          <p>OX Market Price: ${oxtickerdata?.marketprice}</p>
          <br />
          <p>OX 24 Hour High: ${oxpricedata?.high24h}</p>
          <br />
          <p>OX 24 Hour Low: ${oxpricedata?.low24h}</p>
          <br />
          <p>OX 24 Hour Volume: {Number(oxpricedata?.volume24h).toFixed(3)}</p>
          <br />
          <p>OX Open Interest: {oxpricedata?.openInterest}</p>
        </div>
        <br />
        <Button link='https://moonshot.money?ref=vtsmoh24uf' icon={<Image src={moonLogo} height={h} alt="Moonshot" />} name='Moonshot' backgroundcolor={variables.purple} />
        <Button link='https://raydium.io/swap/?inputMint=sol&outputMint=8Ki8DpuWNxu9VsS3kQbarsCWMcFGWkzzA8pUPto9zBd5&referrer=9yA9LPCRv8p8V8ZvJVYErrVGWbwqAirotDTQ8evRxE5N' icon={<Image src={trading} height={h} alt="Raydium" />} name='Raydium' backgroundcolor={variables.discordColor} />
        <Button link='https://dexscreener.com/solana/atwmaa6t9t8cq8xccccfpgdnnqyxhscunuy6wvri7fke' icon={<Image src={lockLogo} height={h} alt="DEXSCREENER" />} name='DEXSCREENER' backgroundcolor={variables.githubColor} />
        <Button link='https://t.me/bonkbot_bot?start=ref_jyzn2_ca_8Ki8DpuWNxu9VsS3kQbarsCWMcFGWkzzA8pUPto9zBd5' icon={<Image src={bonkLogo} alt="Bonk" height={h} />} name='Bonk Buy' backgroundcolor={variables.twitterColor} />
      </Container>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <Canvas>
          <RainingLockersBackground holders={holderdata?.totalHolders}/>
        </Canvas>
      </div>
    </Suspense>
  )
}