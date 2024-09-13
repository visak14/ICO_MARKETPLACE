import React, { useState } from "react"

import Input from "./Input";
import Button from "./Button";

const WidthdrawToken = ({
  address,
transferTokens,
connectWallet,
setOpenWidthdrawToken,
}) => {

  const [WidthdrawQuantity , setWidthdrawQuantity] = useState({
      token:"",
      amount:"",
  })
  return <>
    <div className="modal">
  <div className="modal-content">
    <span onClick={() => setOpenWidthdrawToken(false)} className="close">
      &times;
    </span>
    <h2>Widhthdraw Token</h2>
    <div className="input-Container" style={{ marginTop: '1rem' }}>
      <Input 
        placeholder={"Token Address"}
        handleChange={(e) => setWidthdrawQuantity({
          ...WidthdrawQuantity,
          token: e.target.value
        })
        }
      />
      <Input 
        placeholder={"Quentity"}
        handleChange={(e) => setWidthdrawQuantity({
          ...WidthdrawQuantity,
         amount: e.target.value
        })
        } 
        
      />
    </div>
    <div className="button-box" style={{ marginTop: "1rem" }}>
      {
        address ? (
          <Button 
            name="Create ICO"
            handleClick={() => WidthdrawToken(WidthdrawQuantity)}
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
  </>
};

export default WidthdrawToken;
