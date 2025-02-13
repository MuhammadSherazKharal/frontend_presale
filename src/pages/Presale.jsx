import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "../context/WalletConnection";
import WalletConnectProvider from "@walletconnect/web3-provider";

import PresaleABI from '../abis/Presale.json';
import TokenABI from '../abis/Token.json';
import USDTABI from '../abis/USDT.json';

const Presale = () => {
  const [presaleContract, setPresaleContract] = useState(null);
  const [tokenPriceInETH, setTokenPriceInETH] = useState(null);
  const [tokenPriceInUSDT, setTokenPriceInUSDT] = useState(null);
  const [tokensAvailableForSale, setTokensAvailableForSale] = useState(null);
  const [tokensToBuy, setTokensToBuy] = useState(0);
  const [ethAmount, setEthAmount] = useState(0);
  const [usdtAmount, setUsdtAmount] = useState(0);
  const { account, signer, provider, connectWallet, network, balances, disconnectWallet, setAccount, shortenAddress, loading } = useWallet();



  //Local testnet ganache
  
  const presaleAddress = "0x0A831c7e9B0d48FEC6a52D8dD6eB5DdFD07f53c9";
  const tokenAddress = "0xCF9b227548BF53FbeAd0043af79301C3030Cc9D6";
  const usdtAddress = "0x01D63ac37E8eDbc70c2060De09499C22422C3755";

  useEffect(() => { 
    const initialize = async () => {
      if (account && provider && signer) {
        try {
          console.log('HIiiiiiiiiiiiiiiii')
          const PresaleContract = new ethers.Contract(presaleAddress, PresaleABI.abi, signer);
          const contractToken = new ethers.Contract(tokenAddress, TokenABI.abi, signer);
          const contractUSDT = new ethers.Contract(usdtAddress, USDTABI.abi, signer);
          console.log('Neeela')
          const _tokenPriceInETH = await PresaleContract.tokenPriceInETH();
          setTokenPriceInETH(ethers.utils.formatUnits(_tokenPriceInETH, "ether"));
          console.log('peeeeela');
          const _tokenPriceInUSDT = await PresaleContract.tokenPriceInUSDT();
          setTokenPriceInUSDT(_tokenPriceInUSDT);
    
          const _tokensAvailableForSale = await PresaleContract.tokensAvailableForSale();
          setTokensAvailableForSale(ethers.utils.formatUnits(_tokensAvailableForSale, "ether"));
          console.log('Hiiiiiiiiiiiiiiiiiiiiiiiiiiii')
          console.log(_tokenPriceInUSDT)
          console.log(_tokenPriceInETH)

          setPresaleContract(PresaleContract);
        } catch (error) {
          console.error("Error initializing Ethereum connection:", error);
        }
      } 
    };

    initialize();
  }, [account, provider, signer]);

  // Handle ETH amount change and calculate tokens to buy
  const handleEthAmountChange = (event) => {
    const amountInETH = event.target.value;
    setEthAmount(amountInETH);
    const tokens = (amountInETH / tokenPriceInETH).toFixed(2);
    setTokensToBuy(tokens);
  };

  // Handle USDT amount change and calculate tokens to buy
  const handleUsdtAmountChange = (event) => {
    const amountInUSDT = event.target.value;
    setUsdtAmount(amountInUSDT);
    const tokens = (amountInUSDT / tokenPriceInUSDT).toFixed(2);
    setTokensToBuy(tokens);
  };

  // Buy tokens using ETH
  const handleBuyWithETH = async () => {
    try {
      const tx = await presaleContract.buyWithETH({
        value: ethers.utils.parseUnits(ethAmount, "ether"),
      });
      await tx.wait();
      alert("Transaction Successful!");
    } catch (error) {
      console.error(error);
      alert("Transaction Failed!");
    }
  };

  // Buy tokens using USDT
  const handleBuyWithUSDT = async () => {
    try {
      const usdtContract = new ethers.Contract(usdtAddress, ["function approve(address spender, uint256 amount)"], signer);
      const amountInUSDT = ethers.utils.parseUnits(usdtAmount, 6); // USDT has 6 decimals
      await usdtContract.approve(presaleAddress, amountInUSDT);

      const tx = await presaleContract.buyWithUSDT(amountInUSDT);
      await tx.wait();
      alert("Transaction Successful!");
    } catch (error) {
      console.error(error);
      alert("Transaction Failed!");
    }
  };

  // Modify token price in presale contract to $0.00213 per token
  const modifyPresalePrice = async () => {
    try {
      const newPriceInETH = ethers.utils.parseUnits('0.00213', 'ether'); // $0.00213 in ETH
      const newPriceInUSDT = ethers.utils.parseUnits('0.00213', 6); // Assuming USDT has 6 decimals

      const tx = await presaleContract.updateTokenPrice(newPriceInETH, newPriceInUSDT);
      await tx.wait();
      alert("Token price updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update token price!");
    }
  };

  // End presale and show vesting functionality
  const endPresale = async () => {
    try {
      const tx = await presaleContract.endPresale();
      await tx.wait();
      alert("Presale ended successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to end presale!");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
    <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Token Presale</h1>
  
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">ETH to Tokens</h2>
      <input
        type="number"
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter ETH amount"
        value={ethAmount}
        onChange={handleEthAmountChange}
      />
      <p className="text-gray-600 mb-4">You can buy {tokensToBuy} tokens with {ethAmount} ETH</p>
      <button
        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        onClick={handleBuyWithETH}
      >
        Buy with ETH
      </button>
    </div>
  
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">USDT to Tokens</h2>
      <input
        type="number"
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter USDT amount"
        value={usdtAmount}
        onChange={handleUsdtAmountChange}
      />
      <p className="text-gray-600 mb-4">You can buy {tokensToBuy} tokens with {usdtAmount} USDT</p>
      <button
        className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        onClick={handleBuyWithUSDT}
      >
        Buy with USDT
      </button>
    </div>
  
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Presale Information</h2>
      <p className="text-gray-600 mb-2">Token Price in ETH: {tokenPriceInETH} ETH</p>
      <p className="text-gray-600 mb-2">Token Price in USDT: {tokenPriceInUSDT} USDT</p>
      <p className="text-gray-600">Tokens Available for Sale: {tokensAvailableForSale} tokens</p>
    </div>
  
    <div className="flex space-x-4">
      <button
        className="w-full py-3  bg-blue-500  text-white rounded-lg hover:bg-yellow-600 transition"
        onClick={modifyPresalePrice}
      >
        Modify Token Price
      </button>
      <button
        className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-red-600 transition"
        onClick={endPresale}
      >
        End Presale
      </button>
    </div>
  </div>
  
  );
};

export default Presale;
