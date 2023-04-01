import {
  ConnectButton,
  ConnectWalletProvider,
  getDefaultConnectors,
  useConnectWallet,
} from "@shopify/connect-wallet";
import { Tokengate } from "@shopify/tokengate";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { useEvaluateGate } from './useEvaluateGate';

const _App = () => {
  const { isLocked, unlockingTokens, evaluateGate, gateEvaluation } = useEvaluateGate();
  const { wallet } = useConnectWallet({
    onConnect: (wallet) => {
      evaluateGate(wallet);
    },
  });
  const { requirements, reaction } = getGate();
  console.log("isLocked: " + isLocked);
  console.log("unlockingTokens: " + JSON.stringify(unlockingTokens));
  console.log("requirements: " + JSON.stringify(requirements));
  
  return (
    <Tokengate
      isConnected={Boolean(wallet)}
      connectButton={<ConnectButton />}
      isLoading={false}
      requirements={requirements}
      reaction={reaction}
      isLocked={isLocked}
      unlockingTokens={unlockingTokens}
    />
  );
};

export const App = () => {
  return (
    <WagmiConfig client={client}>
      <ConnectWalletProvider chains={chains} wallet={undefined}>
        <_App />
      </ConnectWalletProvider>
    </WagmiConfig>
  );
};

const getGate = () => window.myAppGates?.[0] || {};

const { chains, provider, webSocketProvider } = configureChains(
  [polygonMumbai],
  [publicProvider()]
);

const { connectors } = getDefaultConnectors({ chains });

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});
