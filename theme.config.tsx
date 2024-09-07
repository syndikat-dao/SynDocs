import React from 'react';
import { DocsThemeConfig, useTheme } from 'nextra-theme-docs';
import { useRouter } from 'next/router'
import { useWallet } from '@solana/wallet-adapter-react'
import { DisconnectButton } from './components/DisconnectButton';
import Link from 'next/link';

const config: DocsThemeConfig = {
  logo: <img src="/logo.png" alt="Logo" width="50" height="25" />,
  project: {
    link: 'https://github.com/syndikat-dao/SynDocs',
    icon: () => {
      const { theme } = useTheme()
      return (
        <svg width="24px" height="24px" viewBox="0 0 22 22" fill={theme === 'dark' ? 'white' : 'black'}>
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.606 9.606 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48C19.137 20.107 22 16.373 22 11.969 22 6.463 17.522 2 12 2z" />
        </svg>
      )
    }
  },
  chat: {
    link: 'https://t.me/+buJ29f8-dphkNDFi',
    icon: (
      <svg width="24px" height="24px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlSpace="preserve" style={{ fillRule: 'evenodd', clipRule: 'evenodd', strokeLinejoin: 'round', strokeMiterlimit: 1.41421 }}>
        <path fill="var(--icon-color)" d="M12,0c-6.626,0 -12,5.372 -12,12c0,6.627 5.374,12 12,12c6.627,0 12,-5.373 12,-12c0,-6.628 -5.373,-12 -12,-12Zm3.224,17.871c0.188,0.133 0.43,0.166 0.646,0.085c0.215,-0.082 0.374,-0.267 0.422,-0.491c0.507,-2.382 1.737,-8.412 2.198,-10.578c0.035,-0.164 -0.023,-0.334 -0.151,-0.443c-0.129,-0.109 -0.307,-0.14 -0.465,-0.082c-2.446,0.906 -9.979,3.732 -13.058,4.871c-0.195,0.073 -0.322,0.26 -0.316,0.467c0.007,0.206 0.146,0.385 0.346,0.445c1.381,0.413 3.193,0.988 3.193,0.988c0,0 0.847,2.558 1.288,3.858c0.056,0.164 0.184,0.292 0.352,0.336c0.169,0.044 0.348,-0.002 0.474,-0.121c0.709,-0.669 1.805,-1.704 1.805,-1.704c0,0 2.084,1.527 3.266,2.369Zm-6.423,-5.062l0.98,3.231l0.218,-2.046c0,0 3.783,-3.413 5.941,-5.358c0.063,-0.057 0.071,-0.153 0.019,-0.22c-0.052,-0.067 -0.148,-0.083 -0.219,-0.037c-2.5,1.596 -6.939,4.43 -6.939,4.43Z" />
      </svg>
    )
  },
  primaryHue: {
    light: 162,
    dark: 162,
  },
  navbar: {
    extraContent: DisconnectButton
  },
  docsRepositoryBase: 'https://github.com/syndikat-dao/SynDocs',
  footer: {
    component: ({ menu }) => (
      <footer style={{
        backgroundColor: '#9945FF',
        textAlign: 'center',
        color: '#ffffff',
        fontSize: '14px',
        padding: '2px',
      }}>
        <span>
          {new Date().getFullYear()} ©{' '}
          <Link href="https://syndikat.wtf" target="_blank" rel="noopener noreferrer">
            SyndikatDAO
            </Link>
          {' | '}
          <Link href="/terms">
            Terms
          </Link>
          {' | '}
          <Link href="/privacy">
            Privacy
          </Link>
          {' | '}
          <Link href="/airdrop">
            Airdrop
          </Link>
        </span>
      </footer>
    ),
  },
};

export default config;
