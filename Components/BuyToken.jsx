import React, { useState } from "react"

import Input from "./Input";
import Button from "./Button";


const BuyToken = ({
  address,
buyToken,
connectWallet,
setOpenBuyToken,
buyIco,
currency,
}) => {

  const [tokenQuantity , setTokenQuantity] = useState()
  return <div className="modal">
  <div className="modal-content">
    <span onClick={() => setOpenBuyToken(false)} className="close">
      &times;
    </span>
    <h2>Buy Token</h2>
    <div className="input-Container" style={{ marginTop: '1rem' }}>
      <Input 
        placeholder={"Quentity"}
        handleChange={(e) => setTokenQuantity(
          e.target.value
        )}
      />
      <Input 
        placeholder={tokenQuantity ? `${tokenQuantity * Number(buyIco?.price)} ${currency}` : "Output"}

      
      />
    </div>
    <div className="button-box" style={{ marginTop: "1rem" }}>
      {
        address ? (
          <Button 
            name="Create ICO"
            handleClick={() => buyToken(buyIco?.token , tokenQuantity)}
          />
        ) : (
          <Button 
            name="Connect Wallet"
            handleClick={() => connectWallet()}
          />
        )
      }
    </div>
  </div>
</div>
};

export default BuyToken;
