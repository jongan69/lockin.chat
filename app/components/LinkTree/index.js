"use client"
import React, { Suspense } from 'react';
import { Container } from './styles';
import Image from 'next/image'
import Button from '../Button/index.js';
import variables from '../../variables';
import Header from '../Header';

// Money
import { Canvas } from '@react-three/fiber';
import RainingMoneyBackground from '../Three/RainingMoney'

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
const telegramLogo = require('../../images/telegram.svg');
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
        <Header picture="profile.jpg" title='Jongan' subtitle={`\n💻 SWE  \n 💰 Investor \n 🔒 Crypto`} />
        <Button link='https://jonngan.medium.com' icon={<Image src={mediumLogo} height={h} alt="Medium"/>} name='' backgroundcolor={variables.opt2Color} />
        <Button link='https://www.youtube.com/@jonngan?sub_confirmation=1' icon={<PlayCircleFilledWhiteIcon />} name='' backgroundcolor={variables.youtubeColor} />
        <Button link='https://github.com/jongan69' icon={<GitHubIcon />} name='' backgroundcolor={variables.githubColor} />
        <Button link='https://twitter.com/jongan69' icon={<Image src={twitterLogo} alt="Twitter" height={h}/>} name='' backgroundcolor={variables.twitterColor} />
        <Button link='https://t.me/jonngan' icon={<Image src={telegramLogo} height={h} alt="Telegram"/>} name='' backgroundcolor={variables.opt1Color} />
        <Button link='https://kick.com/jonngan' icon={<Image src={kickLogo} height={h} alt="Kick" />} name='' backgroundcolor={variables.opt1Color} />
        {/* Anything below here is shill */}

        <Button link='https://www.lock.wtf/' icon={<Image src={lockLogo} height={h} alt="Lock.wtf"/>} name='Lock.wtf' backgroundcolor={variables.linkedinColor}/>
        <Button link='https://moonshot.money?ref=vtsmoh24uf' icon={<Image src={moonLogo} height={h} alt="MoonShot"/>} name='Moonshot' backgroundcolor={variables.pink} />
        <Button link='https://promote.ourbit.com/a/Jonngan' icon={<PieChartIcon />} name='Ourbit' backgroundcolor={variables.whatsappColor} />
        <Button link='https://ox.fun/register?shareAccountId=5MU57aDG' icon={<AssignmentIndIcon />} name='OX.FUN' backgroundcolor={variables.purple} />
        <Button link='https://t.me/BullxBetaBot?start=access_GX6U7KNHAJW' icon={<Image src={trading} alt="Bullx" height={h}/>} name='Bullx' backgroundcolor={variables.whatsappColor} />
        <Button link='https://app.prerich.com/ref/37760CGO' icon={<Image src={trading} alt="PreRich" height={h}/>} name='Prerich' backgroundcolor={variables.discordColor} />

      </Container>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <Canvas>
          <RainingMoneyBackground />
        </Canvas>
      </div>
    </Suspense>
  )
}