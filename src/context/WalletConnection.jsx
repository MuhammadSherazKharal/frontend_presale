import { useEffect, useState, useContext, createContext } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

const INFURA_ID = "13aa1219596d4938ba5666aa3b0115a6"; // Your Infura ID

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [web3Modal, setWeb3Modal] = useState({});
  const [loading, setLoading] = useState(false);
  const [signer, setSigner] = useState(null);
  const [network, setNetwork] = useState(null);
  const [balances, setBalance] = useState(null);

  useEffect(() => {
    const initWeb3Modal = async () => {
      const providerOptions = {
        walletconnect: {
          package: (await import("@walletconnect/web3-provider")).default,
          options: {
            infuraId: INFURA_ID,
          },
        },
        injected: {
          package: null,
        },
        coinbasewallet: {
          package: (await import("@coinbase/wallet-sdk")).default,
          options: {
            infuraId: INFURA_ID,
          },
        },
      };

      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions,
      });
      setWeb3Modal(web3Modal);
    };

    initWeb3Modal();
  }, []);

  // useEffect(() => {
  //   // Listen for account changes
  //   if (provider?.provider?.on) {
  //     provider.provider.on("accountsChanged", (accounts) => {
  //       if (accounts.length > 0) {
  //         console.log("New Account:", accounts[0]);
  //         setAccount(accounts[0]);
  //       } else {
  //         disconnectWallet();
  //       }
  //     });
  //   }

  //   // Cleanup listener when the component is unmounted or provider changes
  //   return () => {
  //     if (provider?.provider?.removeListener) {
  //       provider.provider.removeListener("accountsChanged", () => {});
  //     }
  //   };
  // }, [provider]);

  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-2)}`;
  };

  const connectWallet = async (walletName) => {
    setLoading(true);
    try {
      if (!web3Modal) {
        console.error("Web3Modal not initialized");
        return;
      }

      if (web3Modal.cachedProvider) {
        await web3Modal.clearCachedProvider();
        setAccount(null);
        setProvider(null);
      }
      console.log('web3Modal',web3Modal);
      

      // const instance = await web3Modal.connectTo(walletName);
      
      // const ethersProvider = new ethers.BrowserProvider(instance);
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethersProvider);

      const signer = await ethersProvider.getSigner();
      setSigner(signer);

      const network = await ethersProvider.getNetwork();
      setNetwork(network);

      const accounts = await ethersProvider.send("eth_accounts", []);
      setAccount(accounts[0]);
      const balance = await ethersProvider.getBalance(accounts[0]);
      // console.log('B:', ethers.formatUnits(balance, 18));
      setBalance(ethers.formatUnits(balance, 18));
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async () => {
    if (web3Modal) {
      await web3Modal.clearCachedProvider();
      setAccount(null);
      setProvider(null);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        provider,
        signer,
        network,
        balances,
        setAccount,
        web3Modal,
        connectWallet,
        disconnectWallet,
        shortenAddress,
        loading,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  return useContext(WalletContext);
};
