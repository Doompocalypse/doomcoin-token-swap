import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { MetaMaskProvider } from "@metamask/sdk-react";

createRoot(document.getElementById("root")!).render(
  <MetaMaskProvider
    debug={false}
    sdkOptions={{
      dappMetadata: {
        name: "Doompocalypse",
        url: window.location.href,
      },
      infuraAPIKey: import.meta.env.VITE_INFURA_PROJECT_ID,
    }}
  >
    <App />
  </MetaMaskProvider>
);