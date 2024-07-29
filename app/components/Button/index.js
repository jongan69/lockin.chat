import React from 'react';
import { Container, Name } from './styles';
// import { createTheme, ThemeProvider } from '@mui/material/styles';

import './styles.css'
// In case you wanna remove Material UI
// const githubLogo = require('../../images/github.svg');
// const youtubeLogo = require('../../images/youtube.svg');
// const mediumLogo = require('../../images/medium.svg');
// const publicLogo = require('../../images/public.svg');
// const godsLogo = require('../../images/godsunchained.svg');



export default function Button({ icon, name, backgroundcolor, link }) {
  return (
    <Container backgroundcolor={backgroundcolor ?? 'black'} href={link} target='_blank'>
      <div className="rainbowIcon" style={{ padding: 10 }}>{icon}</div>     
      <Name>{name}</Name>
    </Container>
  );
}
