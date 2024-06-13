import './styles.css'; // Adjust the path according to your file structure
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Script from 'next/script'; // Import next/script

const announcements = [
  { text: 'Go Silly, or Feel Silly! IDO Now Live on Raydium', link: 'https://www.dexlab.space/mintinglab/spl-token/B2Qfkrw8SNr7dBaxBr62zTQmF74f6aUFw8cdibvB3L5k1' },
  { text: 'Become a Syndikat Citizen: Apply Today!', link: 'https://eu.jotform.com/build/232253084368053' },
  { text: 'Empower Content Creators & Free Users! Support Optik.wtf', link: '/Optik' },
];

function MyApp({ Component, pageProps }) {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAnnouncement((prevAnnouncement) => (prevAnnouncement + 1) % announcements.length);
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <Head>
        {/* Remove the <script> tag and use next/script instead */}
        <Script
          data-embed-id="47342c49-c1e4-4cba-8394-ceed2f599550"
          data-base-api-url="http://63.32.53.189:3001/api/embed"
          src="http://63.32.53.189:3001/embed/anythingllm-chat-widget.min.js"
        ></Script>
      </Head>
      <div className="announcement-bar">
        <a href={announcements[currentAnnouncement].link}>{announcements[currentAnnouncement].text}</a>
      </div>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
