import React, {useEffect, useState} from "react";
import toast from "react-hot-toast"


import { useStateContext } from "../Context/index";
import Header from "../Components/Header"
import Input from "../Components/Input"
import Button from "../Components/Button"
import Table from "../Components/Table"
import PreSaleList from "../Components/PreSaleList.jsx"
import UploadLogo from "../Components/UploadLogo.jsx"
import Loader from "../Components/Loader.jsx"
import Footer from "../Components/Footer.jsx"
import ICOMarket from "../Components/ICOMarket.jsx"
import TokenCreator from "../Components/TokenCreator.jsx"
import TokenHistory from "../Components/TokenHistory.jsx"
import Marketplace from "../Components/Marketplace.jsx"
import CreateICO from "../Components/CreateICO.jsx"
import Card from "../Components/Card.jsx"
import BuyToken from "../Components/BuyToken.jsx"
import WidthdrawToken from "../Components/WidthdrawToken.jsx"
import TokenTransfer from "../Components/TokenTransfer.jsx"


const index = () => {
  const {
    withdrawToken,
    transferTokens,
     
      createICOSALE ,
      buyToken,
      GET_ALL_USER_ICOSALE_TOKEN,
      createERC20,
      GET_ALL_ICOSALE_TOKEN,
      connectWallet,
      openBuyToken,
       setOpenBuyToken,
       openWidthdrawToken,
       setOpenWidthdrawToken,
       openTransferToken,
       setOpenTransferToken,
       openTokenCreator,
       setOpenTokenCreator,
       openCreateICO,
       setOpenCreateICO,
       address,
       setAddress,
       accountBalance,
       loader,
       setLoader,
       currency,
       setCurrency,
      reCall, 
      
       PINATA_API_KEY,
       PINATA_SECRET_KEY,
       ICO_MARKETPLACE_ADDRESS,
       shortenAddress
  } = useStateContext()



 const [allICOs , setAllICOs]  = useState();
 const [allUserIcos , setAllUserIcos] = useState();

 const [openAllICO, setOpenAllICO] = useState(false);
 const [openTokenHistory , setOpenTokenHistory ] = useState(false);
 const [openICOMarketplace , setOpenICOMarketplace] = useState(false);
 const [buyIco, setBuyIco]= useState()
const notifySuccess = (msg) => toast.success(msg, {duration: 2000})
 const notifyError = (msg) => toast.error(msg, {duration: 2000})


 const copyAddress = () => {
  navigator.clipboard.writeText(ICO_MARKETPLACE_ADDRESS);
  notifySuccess("Copied successfully")
 }

 useEffect(()=>{
  if(address){
    GET_ALL_ICOSALE_TOKEN().then((token)=> {
      console.log("ALL", token);
      setAllICOs(token)
    })
    GET_ALL_USER_ICOSALE_TOKEN().then((token) => {
      console.log("USER",token)
      setAllUserIcos(token)
    })
  }
 },[address ,reCall])

  return <div>
  <Header 
  accountBalance={accountBalance}
    setAddress={setAddress}
    address={address}
    connectWallet={connectWallet}
    ICO_MARKETPLACE_ADDRESS={ICO_MARKETPLACE_ADDRESS}
    shortenAddress={shortenAddress}
    setOpenAllICO={setOpenAllICO}
    openAllICO={openAllICO}
    setOpenTokenCreator={setOpenTokenCreator}
     openTokenCreator={openTokenCreator}
     setOpenTokenHistory={setOpenTokenHistory}
     openTokenHistory={openTokenHistory}
     setOpenICOMarketplace={setOpenICOMarketplace}
     openICOMarketplace={openICOMarketplace}
  />
  <div className="create">
  <h1 style={{ fontSize: "2rem"}}> All ICOs Marketplace</h1>


  
  {allICOs?.length != 0 && (
    <Marketplace 
    array={allICOs}
    shortenAddress={shortenAddress}
    setBuyIco={setBuyIco}
    setOpenBuyToken={setOpenBuyToken}
    currency={setCurrency}
    />


  )}

  
  <Card 
    setOpenAllICO={setOpenAllICO}
    setOpenTokenCreator={setOpenTokenCreator}
    setOpenTransferToken={setOpenTransferToken}
    setOpenTokenHistory={setOpenTokenHistory}
    setOpenWidthdrawToken={setOpenWidthdrawToken}
    setOpenICOMarketplace={setOpenICOMarketplace}
    copyAddress={copyAddress}
    setOpenCreateICO={setOpenCreateICO}
    />
  </div>
  
 {openAllICO && <ICOMarket 
  array={allICOs} 
  shortenAddress={shortenAddress}
 handleClick={setOpenAllICO}
 currency={currency}

 />}
 {openTokenCreator && <TokenCreator 
 createERC20={createERC20}
  shortenAddress={shortenAddress}
  setOpenTokenCreator={setOpenTokenCreator}
  address={address}
  connectWallet={connectWallet}
  PINATA_API_KEY={PINATA_API_KEY}
  PINATA_SECRET_KEY={PINATA_SECRET_KEY}
 />}
 {openTokenHistory && <TokenHistory
shortenAddress={shortenAddress}
setOpenTokenHistory={setOpenTokenHistory}

 />}
 {openCreateICO && <CreateICO
  shortenAddress={shortenAddress}
  setOpenCreateICO={setOpenCreateICO}
  connectWallet={connectWallet}
  address={address}
  createICOSALE={createICOSALE}
/>}
 {openICOMarketplace && <ICOMarket
array={allUserIcos}
shortenAddress={shortenAddress}
handleClick={setOpenICOMarketplace}
currency={currency}

 />}
 {openBuyToken && <BuyToken
address={address}
buyToken={buyToken}
connectWallet={connectWallet}
setOpenBuyToken={setOpenBuyToken}
buyIco={buyIco}
currency={currency}
 />}
 {openTransferToken && <TokenTransfer
address={address}
transferTokens={transferTokens}
connectWallet={connectWallet}
setOpenTransferToken={setOpenTransferToken}

 />}
 {openWidthdrawToken && <WidthdrawToken

address={address}
transferTokens={transferTokens}
connectWallet={connectWallet}
setOpenWidthdrawToken={setOpenWidthdrawToken}
 />}
  <Footer/>
  {loader && <Loader/>}
  </div>;
};

export default index;
