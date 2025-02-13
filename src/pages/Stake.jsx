import { useState, useEffect } from "react";
import { ethers } from "ethers";
import StakeABI from '../abis/Staking.json';
import ADTABI from '../abis/ADT.json';
import axios from 'axios'; 
import Assets from './Assets';
import { useWallet } from "../context/WalletConnection";

//Amoy Testnet
// const contractAddress = "0x2edF38d9ca334B2AAbD0AcB416E22b705102f76a";
// const ADTAddress = "0x52F5F0F622d18aA63c21BBB7eCdA751851224b6f";

const ADTAddress ='0x70c846B827208086f3b305104F93Bb244aA0B0cB';
const contractAddress ='0x702e70E1cf5C74198269056847eDBdA9dd417391'
//Ganache
// const contractAddress = "0xfad91a3173a315aC398B557FFf4E7E333376a198";
// const ADTAddress = "0xaCBfDeFB8413aE05386Da069911e90E4ac620F80";
 
const apiBaseUrl = "http://192.168.10.2:3000";

const stakingDurationMapping = {
  0: `1 year: ${new Date().toLocaleDateString()} to ${new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
  1: `2 years: ${new Date().toLocaleDateString()} to ${new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
  2: `3 years: ${new Date().toLocaleDateString()} to ${new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
};
// TokenCard Component for the "My Tokens" section
const TokenCard = ({ color, label, value, buttonLabel, onButtonClick, amount, onAmountChange, duration, onDurationChange }) => (
  <div className="flex flex-col items-start gap-6 w-full h-[250px]">  {/* Added a fixed height */}
    <p className="text-lg font-semibold text-gray-400">{label}</p>
    <div className="flex items-center justify-center space-x-2 mb-4">
      <div
        className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}
      >
        <i className="fas fa-wallet text-white"></i>
      </div>
      <p className="text-lg font-bold">{value}</p>
    </div>

    {amount !== undefined && onAmountChange && (
      <div className="flex items-center gap-4 w-full">
        <input
          type="number"
          value={amount}
          onChange={onAmountChange}
          placeholder="Enter amount"
          className="bg-[#0d1b34] text-white border border-[#2c365d] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#5c93d3] transition w-[50%]"
        />
        {onDurationChange && (
          <select
            value={duration}
            onChange={onDurationChange}
            className="bg-[#0d1b34] text-white border border-[#2c365d] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#5c93d3] transition w-[50%]"
          >
            <option value={0}>1 Year</option>
            <option value={1}>2 Years</option>
            <option value={2}>3 Years</option>
          </select>
        )}
      </div>
    )}

    {buttonLabel && (
      <div className="flex justify-start w-full mt-auto">  {/* Added mt-auto for bottom alignment */}
        <button
          onClick={onButtonClick}
          className="bg-[#d4a440] hover:bg-[#f5cd63] text-white py-1 px-3 rounded-full"
        >
          {buttonLabel}
        </button>
      </div>
    )}
  </div>
);


function Tokens() {
  const [availableTokens, setAvailableTokens] = useState("0.0");
  const [stakedTokens, setStakedTokens] = useState("0.0");  
  const [rewards, setRewards] = useState("0.0");
  
  // const [provider, setProvider] = useState(null);
  // const [signer, setSigner] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);
  const [ADTcontract, setADTContract] = useState(null);
  const [ADTBalance, setADTBalance] = useState("0");
  // const [account, setAccount] = useState(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [stakingDuration, setStakingDuration] = useState(0);
  const [popupMessage, setPopupMessage] = useState(null);
  const [showPopup, setShowPopup] = useState(false); 
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage, setTransactionsPerPage] = useState(10);
  const { account,signer,provider, connectWallet,network,balances, disconnectWallet,setAccount, shortenAddress, loading } = useWallet();

  useEffect(() => { 
    const initialize = async () => {

      
      if (account && provider && signer) {
        try {
        
          const stakeContract = new ethers.Contract(contractAddress, StakeABI.abi, signer);

          console.log('this is contract checker',stakeContract);
          console.log('ABI is This :', StakeABI);
         
          const contractADT = new ethers.Contract(ADTAddress, ADTABI.abi, signer);
          // let tx;
          // const mint = ethers.parseUnits('100', 18);
          // tx = await contractADT.transfer(stakeContract, mint);
          console.log('this is Token checker',contractADT);
    
          setADTContract(contractADT);
          setStakingContract(stakeContract);
        
     await fetchTransactions();
        } catch (error) {
          console.error("Error initializing Ethereum connection:", error);
        }
      } 
    };

    

    initialize();
  }, [account, provider, signer,network]);





  useEffect (() => {
   
    const walletType = "injected";
    if (!account) {
       connectWallet(walletType); 
    }
  },[account]);
  
  useEffect(() => {
    if (account ) {
      console.log('Here I\'m Acount Balance',balances);
      fetchTokenData();
      balance();
    }
  }, [account,balances]);


  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/getallstakingtransctions/${account}`);
      if (response.ok) {
        const data = await response.json();
        const mappedTransactions = data.map(transaction => ({
          id: transaction.id,
          token: transaction.token,
          reward: transaction.reward,
          amount: transaction.amount,
          action: transaction.action,
          duration: transaction.duration,
        }));
        setTransactions(mappedTransactions);
      } else {
        console.error('Failed to fetch transactions:', response.statusText);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };


  const fetchTokenData = async () => {
    try {
      if (stakingContract) {
        const staked = await stakingContract.getUserStakingList(account, stakingDuration); 
        console.log('staked ',staked);
        console.log('staked Amount ',ethers.formatUnits(staked.StakedAmount, 18));

        const reward =staked.rewardsEarned;
        console.log('Reward Amount ',ethers.formatUnits(reward, 18));



        setAvailableTokens("0.0");  
        setStakedTokens(ethers.formatUnits(staked.StakedAmount, 18));
        setRewards(ethers.formatUnits(reward, 18));
      }
    } catch (error) {
      console.error("Error fetching token data:", error);
    }
  };
  const balance = async () => {
    try {
      const ADTBalance = await ADTcontract.balanceOf(account);
      const ContractBalance = await ADTcontract.balanceOf(contractAddress); 

      setADTBalance(ethers.formatUnits(ADTBalance, 18)); 
      // setStakingContract(ethers.formatUnits(ContractBalance, 18));  
      await fetchTokenData()

      console.log('ADT', ethers.formatUnits(ADTBalance, 18));
      console.log('Contract', ethers.formatUnits(ContractBalance, 18));
    } catch (error) {
      console.error("Failed to fetch balances:", error);
    }
  };


  const stakeTokens = async () => {
    try {
      let tx;
      const ADTquantity = ethers.parseUnits(stakeAmount, 18); 
      tx = await ADTcontract.approve(contractAddress, ADTquantity);
      await tx.wait();
      tx = await stakingContract.stakeTokens(stakingDuration,ADTquantity); 
      await tx.wait();
      console.log('Transaction Hash:', tx.hash);
      await balance();
      await axios.post(`${apiBaseUrl}/createstakingtransaction`, {
        token: 'ADT',
        duration: stakingDurationMapping[stakingDuration],
        amount: stakeAmount,
        reward: ethers.formatUnits(await stakingContract.calculateReward(account, stakingDuration), 18),
        action: 'staked',
        user: account,
      });
      await tx.wait();
      setPopupMessage("Tokens staked successfully!");
      setShowPopup(true);
      await fetchTokenData();
    } catch (error) {
      console.error("Error staking tokens:", error);
      setPopupMessage("Error staking tokens."); // Set error message
      setShowPopup(true);
    }
  };

  const unstakeTokens = async () => {
    try {
     
      const tx = await stakingContract.unstakeTokens(stakingDuration);
      console.log('Transaction Hash:', tx.hash); 
      await tx.wait();
      await balance();
      await axios.post(`${apiBaseUrl}/createstakingtransaction`, {
        token: 'ADT',
        duration: stakingDurationMapping[stakingDuration],
        amount: stakeAmount,
        reward: rewards,
        action: 'unstaked',
        user: account,
      });
      setPopupMessage("Tokens unstaked successfully!"); // Set success message
      setShowPopup(true);
      await fetchTokenData();
    } catch (error) {
      console.error("Error unstaking tokens:", error);
      setPopupMessage("Error unstaking tokens."); // Set error message
      setShowPopup(true);
    }
  };

  const claimReward = async () => {
    try {
      const tx = await stakingContract.claimReward(stakingDuration) 
      await tx.wait();
      await balance();
      await axios.post(`${apiBaseUrl}/createstakingtransaction`, {
        token: 'ADT',
        duration: stakingDurationMapping[stakingDuration],  
        amount:  ethers.formatUnits(await stakingContract.calculateReward(account, stakingDuration), 18),
        reward: ethers.formatUnits(await stakingContract.calculateReward(account, stakingDuration), 18),
        action: 'claimed',
        user: account,
      });
      setPopupMessage("Reward claimed successfully!"); // Set success message
      setShowPopup(true); 
      await fetchTokenData();
    } catch (error) {
      console.error("Error claiming reward:", error);
      setPopupMessage("Error claiming reward."); // Set error message
      setShowPopup(true); 
    }
  };
  const closePopup = () => {
    setShowPopup(false);
  };
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

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          console.log("New Account:", accounts[0]);
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


  return (
    <div>
      <div className="bg-[#0d1b34] text-white min-h-screen flex flex-col">
        <div className="flex flex-col lg:flex-row flex-1 w-full mx-auto">
          {/* Main Content */}
          <main className="flex-1">
            {/* My Tokens Section */}
            <section className="bg-[#0d1b34] p-4 md:p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">My Tokens</h2>
              <section className="bg-[#1c2340] border border-gray-600 mb-4 p-4 md:p-6 rounded-lg shadow-lg">
                <div className="grid md:grid-cols-3 gap-6 text-left">
                  
                  <div className="md:block hidden">
                    <TokenCard
                      color="bg-blue-600"
                      label="Available Tokens"
                      value={ADTBalance}
                      // value={balances}
                      buttonLabel="Stake Tokens"
                      onButtonClick={stakeTokens}
                      amount={stakeAmount}
                      onAmountChange={(e) => setStakeAmount(e.target.value)}
                      duration={stakingDuration}
                      onDurationChange={(e) => setStakingDuration(Number(e.target.value))}
                    />
                  </div>
                  <div className="md:hidden block">
                    <TokenCard
                      color="bg-blue-600"
                      label="Available Tokens"
                      value={availableTokens}
                    />
                  </div>

                  <TokenCard
                    color="bg-yellow-600"
                    label="Staked Tokens"
                    value={stakedTokens}
                    buttonLabel="Unstake Tokens"
                    onButtonClick={unstakeTokens}
                  
                  />

                  <div className="md:hidden block">
                    <TokenCard
                      color="bg-pink-600"
                      label="Rewards"
                      value={rewards}
                      buttonLabel="Claim Reward"
                      onButtonClick={claimReward}
                    />
                  </div>
                  <div className="md:block hidden">
                    <TokenCard
                      color="bg-pink-600"
                      label="Rewards"
                      value={rewards}
                      buttonLabel="Claim Reward"
                      onButtonClick={claimReward}
                    />
                  </div>
                </div>
              </section>
            </section>

            {/* Staked Tokens Section */}
         <section className="bg-[#0d1b34] p-4 md:p-6 rounded-lg">
  <div className="bg-[#1c2340] border border-gray-600 p-4 rounded-lg">
    <h2 className="text-xl font-bold mt-4 text-center md:text-left mb-10">
      Staked Tokens
    </h2>
    <div className="overflow-x-auto max-h-80">
    {currentTransactions.length > 0 ? (
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-[#0d1b34] text-[#9197b0] sticky top-0 z-10">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
              Tokens
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
              Duration
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
              Value
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
              Reward
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-600">
          {currentTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-6 py-4 text-sm text-gray-300">
                {transaction.token}
              </td>
              <td className="px-6 py-4 text-sm text-gray-300">
                {transaction.duration}
              </td>
              <td className="px-6 py-4 text-sm text-gray-300">
                {transaction.amount}
              </td>
              <td className="px-6 py-4 text-sm text-gray-300">
                {transaction.value || ''}
              </td>
              <td className="px-6 py-4 text-sm text-gray-300">
                {transaction.reward}
              </td>
              <td className="px-6 py-4 text-sm text-gray-300">
                {transaction.action}
              </td>
            </tr>
          ))}
        </tbody>
      </table>):(
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
    </div>)}
  </div>
</section>



          </main>
        </div>
      </div>
       {/* Popup Notification */}
       {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#0d1b34] text-white px-6 py-4 rounded shadow-lg">
            <p>{popupMessage}</p>
            <button
              onClick={closePopup}
              className="bg-[#d4a440] hover:bg-[#f5cd63] text-white font-bold py-2 px-4 rounded mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
       {/* <>
      <Assets stakedTokens={stakedTokens} />
    </> */}
    </div>
    
  );
}

export default Tokens;
