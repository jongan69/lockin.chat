"use client"
import React, { Suspense } from 'react';
import { Container } from './styles';
import Image from 'next/image'
import Button from '../Button/index.js';
import variables from '../../variables';
import Header from '../Header';

// Money
import { Canvas } from '@react-three/fiber';
import RainingMoneyBackground from '../Three/RainingLockins'

// Logos
// import AppsIcon from '@material-ui/icons/Apps';
import PieChartIcon from '@mui/icons-material/PieChart';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import GitHubIcon from '@mui/icons-material/GitHub';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

// Other Logos for links
const trading = require('../../images/trade.svg');
const kickLogo = require('../../images/kick.svg');
const mediumLogo = require('../../images/medium.svg');
const twitterLogo = require('../../images/twitter.svg');
const bonkLogo = require('../../images/bonk.svg');
const lockLogo = require('../../images/logo.svg');
const moonLogo = require('../../images/moon.svg');
// const discordLogo = require('../../images/discord.svg');
// import ArticleIcon from '@mui/icons-material/Article';
// const instagramLogo = require('../../images/instagram.svg');
// const linkedinLogo = require('../../images/linkedin-in.svg');
// const tiktokLogo = require('../../images/tiktok.svg');
// const whatsappLogo = require('../../images/whatsapp.svg');


export default function LinkTree() {

  const h = 20;
  function Loading() {
    return <h2>🌀 Loading...</h2>;
  }

  return (
    <Suspense fallback={<Loading />}>
      <Container>
        <Header picture="profile.png" title='Lockin Chat' subtitle={`Its Time To Lock TF In 🔒`} />
        <Button link='https://moonshot.money?ref=vtsmoh24uf' icon={<Image src={moonLogo} height={h} alt="Moonshot"/>} name='Moonshot' backgroundcolor={variables.purple} />
        <Button link='https://www.youtube.com/@jonngan?sub_confirmation=1' icon={<Image src={trading} height={h} alt="Raydium"/>} name='Raydium' backgroundcolor={variables.discordColor} />
        <Button link='https://dexscreener.com/solana/atwmaa6t9t8cq8xccccfpgdnnqyxhscunuy6wvri7fke' icon={<Image src={lockLogo} height={h} alt="DEXSCREENER" />} name='DEXSCREENER' backgroundcolor={variables.githubColor} />
        <Button link='https://t.me/bonkbot_bot?start=ref_jyzn2_ca_8Ki8DpuWNxu9VsS3kQbarsCWMcFGWkzzA8pUPto9zBd5' icon={<Image src={bonkLogo} alt="Bonk" height={h}/>} name='Bonk Buy' backgroundcolor={variables.twitterColor} />
      </Container>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <Canvas>
          <RainingMoneyBackground />
        </Canvas>
      </div>
    </Suspense>
  )
}