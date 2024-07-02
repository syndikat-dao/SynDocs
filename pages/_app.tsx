import './styles.css';
import { useState, useEffect } from 'react'
import { WalletConnectionProvider } from '../components/WalletConnectionProvider'
import { AuthWrapper } from '../components/AuthWrapper'
import { useRouter } from 'next/router'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import config from '../theme.config'
import { DisconnectButton } from '../components/DisconnectButton'
import ReactDOM from 'react-dom/client';

const announcements = [
  { text: 'Go Silly, or Feel Silly! IDO Now Live on Raydium', link: 'https://www.dexlab.space/mintinglab/spl-token/B2Qfkrw8SNr7dBaxBr62zTQmF74f6aUFw8cdibvB3L5k1' },
  { text: 'Become a Syndikat Citizen: Apply Today!', link: 'https://eu.jotform.com/build/232253084368053' },
  { text: 'Empower Content Creators & Free Users! Support Optik.wtf', link: '/Optik' },
]

function MyApp({ Component, pageProps }: AppProps) {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAnnouncement((prevAnnouncement) => (prevAnnouncement + 1) % announcements.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])


  useEffect(() => {
    // Render the DisconnectButton in the navbar
    const container = document.getElementById('disconnect-button-container');
    if (container && router.pathname !== '/auth') {
      const root = ReactDOM.createRoot(container);
      root.render(<DisconnectButton />);
    }
  }, [router.pathname]);

  return (
    <WalletConnectionProvider>
      <AuthWrapper>
        {({ isAuthorized, isLoading, authState, handleSignMessage }) => (
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <>
              {isAuthorized && router.pathname !== '/auth' && (
                <div className="announcement-bar">
                  <a href={announcements[currentAnnouncement].link}>{announcements[currentAnnouncement].text}</a>
                </div>
              )}
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <>
                  <Component 
                    {...pageProps} 
                    authState={authState} 
                    handleSignMessage={handleSignMessage}
                  />
                  {isAuthorized && router.pathname !== '/auth' && (
                    <script 
                      src="https://gpt.syndikat.wtf/embed/anythingllm-chat-widget.min.js" 
                      data-embed-id="5bcca449-acc6-437c-8d33-a0657b8900bb" 
                      data-base-api-url="https://gpt.syndikat.wtf/api/embed"
                    />
                  )}
                </>
              )}
            </>
          </ThemeProvider>
        )}
      </AuthWrapper>
    </WalletConnectionProvider>
  )
}

export default MyApp