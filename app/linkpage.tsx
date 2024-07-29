"use client"
import React from 'react';
import './App.css';
import LinkTree from './components/LinkTree';
import { Analytics } from "@vercel/analytics/react"

export default function App() {

  return (
    <>
      <LinkTree />
      <Analytics/>
    </>
  );
}