"use client"
import React from 'react';
import './App.css';
import LinkTree from './components/LinkTree';
import { Analytics } from "@vercel/analytics/react"
import Script from 'next/script';

export default function App() {

  return (
    <>
      <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6202902142885850"
        crossOrigin="anonymous" />
      <LinkTree />
      <Analytics />
    </>
  );
}