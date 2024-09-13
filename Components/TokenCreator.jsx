import React, { useState } from "react";
import { BigNumber } from "ethers"; // Import BigNumber from ethers.js

import UploadLogo from "./UploadLogo";
import Input from "./Input";
import Button from "./Button";

const TokenCreator = ({
  createERC20,
  shortenAddress,
  setOpenTokenCreator,
  address,
  connectWallet,
  PINATA_API_KEY,
  PINATA_SECRET_KEY,
}) => {
  const notifySuccess = (msg) => toast.success(msg, { duration: 200 });
  const notifyError = (msg) => toast.error(msg, { duration: 200 });

  const [imageURL, setimageURL] = useState("");
  const [loader, setLoader] = useState(false);

  const [token, setToken] = useState({
    name: "",
    symbol: "",
    supply: "",
  });

  // Function to handle token creation
  const handleCreateToken = () => {
    // Validate the supply field and convert it to a BigNumber
    try {
      const supplyValue = BigNumber.from(token.supply); // Convert supply to BigNumber
      if (supplyValue.lte(0)) {
        notifyError("Supply must be a positive number.");
        return;
      }

      createERC20({ ...token, supply: supplyValue }, address, imageURL);
    } catch (error) {
      notifyError("Invalid token supply. Please enter a valid number.");
      console.error("Error in token creation:", error);
    }
  };

  return (
    <div id={"myModal"} className={"modal"}>
      <div className="modal-content">
        <span onClick={() => setOpenTokenCreator(false)} className="close">
          &times;
        </span>
        <h2 style={{ marginBottom: "1rem" }}>Create Token</h2>

        <UploadLogo
          imageURL={imageURL}
          setimageURL={setimageURL}
          setLoader={setLoader}
          PINATA_API_KEY={PINATA_API_KEY}
          PINATA_SECRET_KEY={PINATA_SECRET_KEY}
        />

        <div className="input-Container">
          <Input
            placeholder={"Name"}
            handleChange={(e) => setToken({ ...token, name: e.target.value })}
          />
          <Input
            placeholder={"Symbol"}
            handleChange={(e) =>
              setToken({ ...token, symbol: e.target.value })
            }
          />
          <Input
            placeholder={"Supply"}
            handleChange={(e) =>
              setToken({ ...token, supply: e.target.value })
            }
          />
        </div>

        <div className="button-box" style={{ marginTop: "1rem" }}>
          {address ? (
            <Button
              name="Create Token"
              handleClick={handleCreateToken} // Use the new function here
            />
          ) : (
            <Button name="Connect Wallet" handleClick={() => connectWallet()} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenCreator;
