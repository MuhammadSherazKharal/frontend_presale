import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import usdt from "../assets/usdt.svg";
import SwapABI from '../abis/Swap.json';
import ADTABI from '../abis/ADT.json';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react';
import { useWallet } from '../context/WalletConnection';

// Amoy Testnet
const contractAddress = "0xba0Ea388f5961e2b20E2B5393D13900C74CBC065";
const ADTAddress = "0x52F5F0F622d18aA63c21BBB7eCdA751851224b6f";
const USDTAddress = "0x85C2F07C0C5ABCB695019EEfa3F43e14885aD621";


//Ganache

// const contractAddress = "0xAaD8932dA8162b15496f24CeD4c042BEb3789068";
// const ADTAddress = "0x4cc43168c50bf5e3d1a1e60A8a7428D37077A9Fb";
// const USDTAddress = "0x4f3aFa3Ce7d1b7F0f375F332FA83Ebca5E898B14";
const apiBaseUrl = "http://192.168.10.2:3000";



function DashBoard() {
  const [selectedButton, setSelectedButton] = useState("buy");
  // const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [USDTcontract, setUSDTContract] = useState(null);
  const [ADTcontract, setADTContract] = useState(null);
  // const [provider, setProvider] = useState(null);
  const [inputValue, setInputValue] = useState("0");
  const [USDTBalance, setUSDTBalance] = useState("0");
  const [ADTBalance, setADTBalance] = useState("0");
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage, setTransactionsPerPage] = useState(10);
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const { account,signer,provider, connectWallet,network,setAccount, disconnectWallet, shortenAddress, loading } = useWallet();
  // console.log("Wallet>>>>>",walletProvider)
  // console.log("Wallet>>09>>>",isConnected)

  useEffect(() => {
    const initialize = async () => {

      // const walletType = "injected";
      // if (!account) {
      //   await connectWallet(walletType); // Connect wallet if not connected
      // }
      if (account && provider && signer) {
        try {

          // const provider = new ethers.BrowserProvider(window.ethereum);
          // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', provider);

          // const accounts = await provider.send("eth_requestAccounts", []);
          // console.log(accounts);
          // const signer = await provider.getSigner();
          // console.log(signer)
          const contract = new ethers.Contract(contractAddress, SwapABI.abi, signer);
          const contractADT = new ethers.Contract(ADTAddress, ADTABI.abi, signer);
          const contractUSDT = new ethers.Contract(USDTAddress, ADTABI.abi, signer);
          // console.log(contract)

          // setAccount(accounts[0]);
          // setProvider(provider);
          setContract(contract);
          setUSDTContract(contractUSDT);
          setADTContract(contractADT);
        } catch (error) {
          console.error("Failed to connect wallet:", error);
        }
      } 
    };

    

    initialize();
    // fetchTransactions();
  }, [account, provider, signer,network]);

  useEffect (() => {
   
    const walletType = "injected";
    if (!account) {
       connectWallet(walletType); 
    }


    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/getallswaptransctions/${account}`);
        if (response.ok) {
          const data = await response.json();
          // Map data to desired format
          if (data.length > 0) {
          const mappedTransactions = data.map(transaction => ({
            id: transaction.id,
            time: transaction.created_at,
            quantity: transaction.quantity,
            amount: transaction.amount,
            action: transaction.action,
            hash: transaction.hash,
          }));
          setTransactions(mappedTransactions);}
          else {
            
            console.log('No transactions found for this account');
            setTransactions([]);
          }
        } else {
          console.error('Failed to fetch transactions:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions()
  },[account])

  const handleButtonClick = (button) => {
    setSelectedButton(button);
  };
  const balance = async () => {
    try {
      const USDTBalance = await USDTcontract.balanceOf(account);
      const ADTBalance = await ADTcontract.balanceOf(account);
      const ContractBalance = await ADTcontract.balanceOf(contractAddress);
      const ContractBalances = await USDTcontract.balanceOf(contractAddress);


      setUSDTBalance(ethers.formatUnits(USDTBalance, 18));
      setADTBalance(ethers.formatUnits(ADTBalance, 18));

      console.log('USDT', ethers.formatUnits(USDTBalance, 18));
      console.log('ADT', ethers.formatUnits(ADTBalance, 18));
      console.log('Contract', ethers.formatUnits(ContractBalance, 18));
      console.log('Contract USDT', ethers.formatUnits(ContractBalances, 18));
    } catch (error) {
      console.error("Failed to fetch balances:", error);
    }
  };
  const handleProceed = async () => {
    if (!contract) return;

  
    try {

      let tx;
      // const mint = ethers.parseUnits('100', 18);
      // tx = await USDTcontract.transfer(contractAddress, mint);
      const ADTquantity = ethers.parseUnits(inputValue || "1", 18);
      const USDTquantity = ethers.parseUnits(inputValue || "1", 18);
      await balance();

      if (selectedButton === "buy") {
        if (typeof contract.buyToken === 'function') {
          tx = await USDTcontract.approve(contractAddress, USDTquantity);
          await tx.wait();
          tx = await contract.buyToken(ADTquantity, {});
          await balance();
        } else {
          console.error("Contract does not have a 'buyToken' function");
          return;
        }
      } else if (selectedButton === "sell") {
        if (typeof contract.sellToken === 'function') {
          tx = await ADTcontract.approve(contractAddress, ADTquantity);
          await tx.wait();
          tx = await contract.sellToken(ADTquantity, {});
          await balance();
        } else { 
          
          console.error("Contract does not have a 'sellToken' function", contract);
          return;
        }
      }

      if (tx) {
        await tx.wait();
        const hash = tx.hash;

        // Prepare data to send to the backend
        const requestData = {
          quantity: ethers.formatUnits(selectedButton === "buy" ? ADTquantity : USDTquantity, 18),
          amount: inputValue,
          hash: hash,
          action: selectedButton.toLocaleUpperCase(),
          user: account
        };

        // Send the data to the backend
        const response = await fetch(`${apiBaseUrl}/createswaptransaction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log('Transaction recorded:', responseData);
          setPopupMessage(`${selectedButton === "buy" ? "Buy" : "Sell"} successful!`);
        } else {
          console.error('Failed to record transaction:', response.statusText);
          setPopupMessage("Error: Transaction recording failed!");
        }

        setShowPopup(true);
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      setPopupMessage("Error: Transaction Failed!!");
      setShowPopup(true);
    }
  };


  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const closePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          // Set new account in state
          setAccount(accounts[0]);
        } else {
          // If no account is found, disconnect the wallet
          disconnectWallet();
        }
      };

      // Listen for account changes
      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        // Clean up the event listener on component unmount
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, [setAccount, disconnectWallet]);

  // Pagination Logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const handlePageChange = (direction) => {
    if (direction === 'next' && (currentPage * transactionsPerPage) < transactions.length) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };



  return (
    <div>
      <div className="bg-[#0d1b34] text-white min-h-screen flex flex-col">
        <div className="flex flex-col lg:flex-row flex-1 w-full mx-auto">
          <main className="flex-1">
            <section className="bg-[#0d1b34] p-4 md:p-6 rounded-lg mb-6">
              <div className="flex bg-[#1c2340] max-w-md mx-auto rounded-2xl items-center justify-between p-1 mb-6 space-x-2">
                <button
                  className={`py-2 px-6 rounded-full w-full transition ${selectedButton === "buy"
                    ? "bg-white text-black"
                    : "bg-transparent text-white"
                    }`}
                  onClick={() => handleButtonClick("buy")}
                >
                  BUY
                </button>
                <button
                  className={`py-2 px-6 rounded-full w-full transition ${selectedButton === "sell"
                    ? "bg-white text-black"
                    : "bg-transparent text-white"
                    }`}
                  onClick={() => handleButtonClick("sell")}
                >
                  SELL
                </button>
              </div>

              <div className="bg-[#1c2340] border border-gray-600 p-4 md:p-6 rounded-lg space-y-6">
                <h2 className="text-xl font-bold text-center md:text-left">
                  Exchange
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4 items-center">
                  <div className="flex flex-col w-full">
                    <label className="block text-white mb-2">
                      {selectedButton === "buy" ? "Buy" : "Sell"}
                    </label>
                    <input
                      type="number"
                      value={inputValue}
                      onChange={handleInputChange}
                      className="bg-[#0d1b34] text-white border border-[#2c365d] rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-[#5c93d3] transition"
                    />
                  </div>

                  <div className="flex items-center bg-[#0d1b34] border border-[#2c365d] rounded-lg p-2 w-[30%] mt-8 space-x-2">
                    <img src={usdt} alt="USDT" className="h-6" />
                    <span className="text-white">
                      {selectedButton === "buy" ? "USDT" : "ADT"}
                    </span>
                  </div>
                </div>

                <p className="text-[#9197b0] text-center lg:text-left">
                  Price:{" "}
                  {selectedButton === "buy"
                    ? "1 ADT per 1 USDT"
                    : "1 ADT per 0.75 USDT"}
                </p>

                <button
                  className="bg-[#d4a440] hover:bg-[#f5cd63] text-white py-3 px-6 rounded-full w-full md:w-auto mx-auto block text-center transition"
                  onClick={() => handleProceed()}
                >
                  Proceed to {selectedButton === "buy" ? "Buy" : "Sell"}
                </button>
              </div>
            </section>


            <section className="bg-[#0d1b34] p-4 md:p-6 rounded-lg">

              <div className="bg-[#1c2340] border border-gray-600 p-4 rounded-lg">
                <h2 className="text-xl font-bold mt-4 text-center md:text-left mb-10">
                  Transactions
                </h2>
                <div className="overflow-x-auto max-h-80">
                {currentTransactions.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-700">

                    <thead className="bg-[#0d1b34] text-[#9197b0]  sticky top-0 z-10">
                      <tr>

                        <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-1 py-3 text-left text-sm font-medium uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                          Action
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                          Transaction Hash
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                      {currentTransactions.map(transaction => (
                        <tr key={transaction.id}>

                          <td className="px-6 py-4 text-sm text-gray-300">
                            {new Date(transaction.time).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {transaction.quantity}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {transaction.amount}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {transaction.action}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {transaction.hash}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>): (
        <p className="text-center text-gray-300 py-4">No transactions found for your account.</p>
      )}

                  
                </div>
                {currentTransactions.length > 0 && (
                <div className="flex justify-between mt-4">
                  <button
                    className="bg-[#d4a440] text-white py-2 px-4 rounded-lg hover:bg-[#f5cd63]"
                    onClick={() => handlePageChange('prev')}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="text-white">
                    Page {currentPage} of {Math.ceil(transactions.length / transactionsPerPage)}
                  </span>
                  <button
                    className="bg-[#d4a440] text-white py-2 px-4 rounded-lg hover:bg-[#f5cd63]"
                    onClick={() => handlePageChange('next')}
                    disabled={indexOfLastTransaction >= transactions.length}
                  >
                    Next
                  </button>
                </div>
                )}
              </div>
            </section>


          </main>
        </div>
      </div>
      {/* Popup Component */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white text-black px-6 pt-4 pb-2 rounded shadow-lg">
            <p>{popupMessage}</p>
            <button
              onClick={closePopup}
              className="bg-[#d4a440] hover:bg-[#f5cd63] text-white py-1 px-2 rounded mt-6 ml-2"
              style={{ marginLeft: '-10px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default DashBoard;

























