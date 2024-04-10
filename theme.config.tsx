import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';



const config: DocsThemeConfig = {
  logo: <img src="/logo.png" alt="Logo" width="50" height="25" />,
  project: {
    link: 'https://github.com/shuding/nextra-docs-template',
  },
  chat: {
    link: 'https://discord.com',
  },
  primaryHue: {
    light: 162,
    dark: 162,
  },
  docsRepositoryBase: 'https://github.com/shuding/nextra-docs-template',
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} ©{' '}
        <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer">
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
        <a href="/jobs" target="_blank" rel="noopener noreferrer">
          Jobs
        </a>
      </span>
    ),
  },
  banner: {
    key: '2.0-release',
    text: (
      <a href="https://nextra.site" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#14F195', color: '#000000' }}>
        Go Silly, or feel Silly! IDO is live now.
      </a>
    ),
  },
}


export default config;
