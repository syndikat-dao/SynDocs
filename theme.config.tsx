import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: <img src="/logo.png" alt="Logo" width="50" height="25" />,
  project: {
    link: 'https://github.com/syndikat-dao/SynDocs',
  },
  chat: {
    link: 'https://discord.com',
  },
  primaryHue: {
    light: 162,
    dark: 162,
  },
  docsRepositoryBase: 'https://github.com/syndikat-dao/SynDocs',
  footer: {
    component: ({ menu }) => (
      <footer style={{ 
        backgroundColor: '#9945FF', 
        textAlign: 'center', 
        color: '#ffffff',
        fontSize: '14px', // Adjust font size as needed
        padding: '2px', // Adjust padding as needed
        // Add any other CSS properties here
      }}>
        <span>
           {new Date().getFullYear()} ©{' '}
          <a href="https://syndikat.wtf" target="_blank" rel="noopener noreferrer">
            SyndikatDAO
          </a>
          {' | '}
          <a href="/terms" target="_blank" rel="noopener noreferrer">
            Terms
          </a>
          {' | '}
          <a href="/privacy" target="_blank" rel="noopener noreferrer">
            Privacy
          </a>
          {' | '}
          <a href="/airdrop" target="_blank" rel="noopener noreferrer">
            Airdrop
          </a>
        </span>
      </footer>
    ),
  },
};

export default config;
