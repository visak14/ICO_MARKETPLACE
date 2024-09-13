import React from "react";
import toast from "react-hot-toast";
import { ICO_MARKETPLACE_ADDRESS } from "../Context/constants";

const ICOMarket = (
  {
    array, 
    shortenAddress,
   handleClick,
   currency,
  }
  
) => {

  const notifySuccess = (msg) => toast.success(msg, {duration: 2000})
 const notifyError = (msg) => toast.error(msg, {duration: 2000})


 const copyAddress = (text) => {
  navigator.clipboard.writeText(text);
  notifySuccess("Copied succesfully");
 }
  return <div className="modal-content">
  <span onClick={() => handleClick(false)} className=" close">
   &times;
  </span>
    <h2>ALL ICO You have created</h2>
    <div className="table-container">
     <table className="custom-table">
        <thead>
         <tr>
            
             <td>Name</td>
             <td>Symbol</td>
             <td>Supply</td>
             <td>Token</td>
             <td>Creator</td>
             <td>Price</td>
         </tr>
        </thead>
        <tbody>
         {
           array?.map((token , index) => (
             <tr key={index + 1}>
              
               <td>{token?.name}</td>
               <td>{token?.symbol}</td>
               <td>{token?.icoSaleBal}</td>
              
               <td  onClick={()=> copyAddress (token?.token)}>
               {shortenAddress(token?.token)}📒
               </td>
               <td  onClick={()=> copyAddress (token?.creator)}>
               {shortenAddress(token?.creator)}📒
               </td>
               <td>{token?.price} {currency}</td>
             </tr>
           ))
         }
        </tbody>
     </table>
    </div>
  </div>
};

export default ICOMarket;
