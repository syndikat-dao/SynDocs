import './styles.css'; // Adjust the path according to your file structure
import type { AppProps } from 'next/app'
import { WalletConnectionProvider } from '../components/WalletConnectionProvider'
import { AuthWrapper } from '../components/AuthWrapper'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletConnectionProvider>
      <AuthWrapper>
        <Component {...pageProps} />
      </AuthWrapper>
    </WalletConnectionProvider>
  )
}

export default MyApp









// import Head from 'next/head';
// import { useEffect, useState } from 'react';
// import Script from 'next/script'; // Import next/script

// const announcements = [
//   { text: 'Go Silly, or Feel Silly! IDO Now Live on Raydium', link: 'https://www.dexlab.space/mintinglab/spl-token/B2Qfkrw8SNr7dBaxBr62zTQmF74f6aUFw8cdibvB3L5k1' },
//   { text: 'Become a Syndikat Citizen: Apply Today!', link: 'https://eu.jotform.com/build/232253084368053' },
//   { text: 'Empower Content Creators & Free Users! Support Optik.wtf', link: '/Optik' },
// ];

// function MyApp({ Component, pageProps }) {
//   const [currentAnnouncement, setCurrentAnnouncement] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentAnnouncement((prevAnnouncement) => (prevAnnouncement + 1) % announcements.length);
//     }, 5000);

//     return () => {
//       clearInterval(timer);
//     };
//   }, []);

//   return (
//     <>
//       {useEffect(() => {
//         const script = document.createElement('script');
//         script.src = 'https://gpt.syndikat.wtf/embed/anythingllm-chat-widget.min.js';
//         script.setAttribute('data-embed-id', '5bcca449-acc6-437c-8d33-a0657b8900bb');
//         script.setAttribute('data-base-api-url', 'https://gpt.syndikat.wtf/api/embed');
//         document.head.appendChild(script);

//         return () => {
//           document.head.removeChild(script);
//         };
//       }, [])}

//       <div className="announcement-bar">
//         <a href={announcements[currentAnnouncement].link}>{announcements[currentAnnouncement].text}</a>
//       </div>
//       <Component {...pageProps} />
//     </>
//   );
// }

// export default MyApp;
