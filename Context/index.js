import React , {useState, useEffect, createContext , useContext} from "react";
import { errors, ethers} from "ethers"
import Web3Modal from 'web3modal';
import toast from 'react-hot-toast'


//Imternal component

import { ERC20Generator , ERC20Generator_BYTECODE,
     handleNetworkSwitch, ICO_MARKETPLACE_ADDRESS , 
     ICO_MARKETPLACE_CONTRACT , TOKEN_CONTRACT , 
     PINATA_API_KEY , PINATA_SECRET_KEY, shortenAddress, 
     ERC20Generator_ABI} from './constants' 
     
     
     const stateContext = createContext();

     export const StateContextProvider = ({children}) => {

        // STATE VERIABLE
        const [address , setAddress] = useState();
        const [accountBalance, setAccountBalance] = useState(null);
        const [loader , setLoader] = useState(false)
        const [reCall, setReCall] = useState(0);
        const [currency, setCurrency] = useState("MATIC")

        //COMPONENT

        const [openBuyToken , setOpenBuyToken] = useState(false);
        const [openWidthdrawToken , setOpenWidthdrawToken] = useState(false);
        const [openTransferToken, setOpenTransferToken]= useState(false);
        const [openTokenCreator, setOpenTokenCreator] = useState(false);
        const [openCreateICO, setOpenCreateICO] = useState(false);

        const notifySuccess = (msg) => toast.success(msg, {duration: 2000})
        const notifyError = (msg) => toast.success(msg, {duration: 2000})

          //FUCNCTIONS

          const checkIfWalletConnected = async () => {
            try {
                if (!window.ethereum) return notifyError("No account found");
                await handleNetworkSwitch();
                const accounts = await window.ethereum.request({
                    method: "eth_accounts",
                });
                if (accounts.length) {
                    setAddress(accounts[0]);
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const getbalance = await provider.getBalance(accounts[0]);
                    const bal = ethers.utils.formatEther(getbalance);
                    setAccountBalance(bal);
                    return accounts[0];
                } else {
                    notifyError("No account found");
                }
            } catch (error) {
                console.log(error);
                notifyError("No account available");
            }
        };
         

          useEffect(()=> {
            checkIfWalletConnected()
          }, [address])

          const connectWallet = async() => {
            try {

              if(!window.ethereum) return notifyError("No acccount found");
              await handleNetworkSwitch()
              const accounts = await window.ethereum.request({
                 method: "eth_requestAccounts", 
              });

              if(accounts.length) {
                  setAddress(accounts[0]);
                 const provider = new ethers.providers.Web3Provider(window.ethereum) ;
                 const getbalance = await provider.getBalance(accounts[0]);
                 const bal = ethers.utils.formatEther(getbalance);
                 setAccountBalance(bal);
                 return accounts[0];

              }
              else {
                  notifyError("No account found")  
              }
            }catch(error){
              console.log(error)
              notifyError("NO account available")
            }
        }


        const _deployContract = async( signer, account, name , symbol, supply , imageURL ) => {
            
             try{
                const factory = new ethers.ContractFactory(
                    ERC20Generator_ABI,
                    ERC20Generator_BYTECODE,
                    signer
                ) 
                const totalSupply = Number(supply);
                const _initialSupply = ethers.utils.parseUnits(supply.toString(), 18);

                let contract = await factory.deploy(_initialSupply, name, symbol);


                const  transaction = await contract.deployed();

                if(contract.address) {
                    const today = Date.now();
                    let date = new Date(today);
                    const _tokenCreateDate = date.toLocaleDateString("en-US");

                    const _token =  {
                       account: account, 
                       supply: supply.toString(),
                       name: name,
                       symbol: symbol,
                       tokenAddreess: contract.address,
                       transactionHash: contract.deployTransaction.hash,
                       createdAt: _tokenCreateDate,
                       logo: imageURL
                    }

                    let tokenHistory = []

                    const history = localStorage.getItem("TOKEN_HISTORY");

                    if(history) {
                        tokenHistory = JSON.parse(localStorage.getItem("TOKEN_HISTORY"));
                        tokenHistory.push(_token);
                        localStorage.setItem("TOKEN_HISTORY", tokenHistory);
                        setLoader(false)
                        setReCall(reCall + 1)
                        setOpenTokenCreator(false)
                    } else {
                        tokenHistory.push(_token);
                        localStorage.setItem("TOKEN_HISTORY", JSON.stringify(tokenHistory));

                        setLoader(false)
                        setReCall(reCall + 1)
                        setOpenTokenCreator(false)
                    }
                     

                }

             } catch(error) {
                setLoader(false)
                notifyError("Sommething went wrong, try later")
                console.log(error)
             }
        }

        const createERC20 = async (token, account, imageURL) => {
            const {name , symbol , supply } = token;

            try{
                   setLoader(true)
                   notifySuccess("Creating token...");
                   if(!name || !symbol || !supply ) {
                    notifyError("Data Missing");
                   }
                   else {
                    const web3Modal = new Web3Modal();
                    const connection = await web3Modal.connect();
                    const provider = new ethers.providers.Web3Provider(connection);
                    const signer = provider.getSigner();

                    _deployContract(signer , account , name , symbol , supply, imageURL)
                   }
            } catch (error) {
                
                setLoader(false)
                notifyError("Something went wrong, try later ")
                console.log(error)
            }
        }

        const GET_ALL_ICOSALE_TOKEN = async () => {
            try{

                setLoader(true)
                const address = await connectWallet();
                const contract = await ICO_MARKETPLACE_CONTRACT()

                if(address) {
                    const allICOSaleToken = await contract.getAllTokens();

                    const _tokenArray = Promise.all(
                        allICOSaleToken.map(async(token)=> {
                            const tokenContract = await TOKEN_CONTRACT(token?.token);

                            const balance  = await tokenContract.balanceOf(
                                ICO_MARKETPLACE_ADDRESS
                            )
                            return {
                                creator: token.creator,
                                token: token.token,
                                name: token.name,
                                symbol: token.symbol,
                                supported: token.supported,
                                price: ethers.utils.formatEther(token?.price.toString()),
                                icoSaleBal: ethers.utils.formatEther(balance.toString()),
                            }
                        })
                    )
                    setLoader(false)
                    return _tokenArray
                }
            } catch (error) {
                notifyError("Something went wrong")
                console.log(error)
            }
        }

        const GET_ALL_USER_ICOSALE_TOKEN = async () => {
            try{

                setLoader(true)
                const address = await connectWallet();
                const contract = await ICO_MARKETPLACE_CONTRACT()

                if(address) {
                    const allICOSaleToken = await contract.getTokenCreatedBy(address);

                    const _tokenArray = Promise.all(
                        allICOSaleToken.map(async(token)=> {
                            const tokenContract = await TOKEN_CONTRACT(token?.token);

                            const balance  = await tokenContract.balanceOf(
                                ICO_MARKETPLACE_ADDRESS
                            )
                            return {
                                creator: token.creator,
                                token: token.token,
                                name: token.name,
                                symbol: token.symbol,
                                supported: token.supported,
                                price: ethers.utils.formatEther(token?.price.toString()),
                                icoSaleBal: ethers.utils.formatEther(balance.toString()),
                            }
                        })
                    )
                    setLoader(false)
                    return _tokenArray
                }
            } catch (error) {
                notifyError("Something went wrong")
                console.log(error)
            }
        }


        const createICOSALE = async (icoSale) => {
            try{
                const {address , price} = icoSale;
                if(!address || !price) return notifyError("Dara is Missing")

                    setLoader(true);
                    notifySuccess("Creating icoSale..")
                    await connectWallet();

                    const contract = await ICO_MARKETPLACE_CONTRACT();

                    const payAmount = ethers.utils.parseUnits(price.toString(), "ether");
                     console.log(payAmount)

                    const transaction  = await contract.createICOSale(address , payAmount, {
                        gasLimit: ethers.utils.hexlify(8000000),
                    });

                    await transaction.wait()

                    if(transaction.hash) {
                        setLoader(false); 
                        setOpenCreateICO(false)
                        setReCall(reCall + 1);
                    }

            } catch (error) {
                setLoader(false)
                setOpenCreateICO(false)
                notifyError("Something went wrong")

                console.log(error)
            }
        }

        const buyToken = async (tokenAddreess , tokenQuantity) => { 
            try{
                    
                setLoader(true);
                notifySuccess("Purchasing token ...")

                if(!tokenQuantity || !tokenAddreess) return notifyError("Data missing");

                const address = await connectWallet();
                const contract = await ICO_MARKETPLACE_CONTRACT()

                const _tokenBal = await contract.getBalance(tokenAddreess)
                const _tokenDetails = await contract.getTokenDetails(tokenAddreess)

                const availableToken = ethers.utils.formatEther(_tokenBal , toString());

                if(availableToken > 0 ) {

                    const price = ethers.utils.formatEther(_tokenDetails.price.toString()) * Number(tokenQuantity);
                    
                    const payAmount = ethers.utils.parseUnits(price.toString(), "ether") 

                     const transaction = await contract.buyToken(
                        tokenAddreess,
                        Number(tokenQuantity),
                        {
                            value: payAmount.toString(),
                            gasLimit: ethers.utils.hexlify(8000000)
                        }
                     ) 

                     await transaction.wait()
                     setLoader(false)
                     setReCall(reCall + 1)
                     setOpenBuyToken(false);
                     notifySuccess("Tranaction completed succcessfully");
                }
                 else {
                    setLoader(false);
                    setOpenBuyToken(false);
                    notifyError("your token balance is 0")
                 }
 
            } catch (error) {
                setLoader(false);
                setOpenBuyToken(false);
                notifyError("something went wrong")
                console.log(error)
            }
        }


        const transferTokens = async (transferTokenData) => {
            try{
              if(!transferTokenData.address || !transferTokenData.amount || !transferTokenData.tokenAdd)
                return notifyError("Data is missing")
              setLoader(true);
              notifySuccess("transaction complete");
             
              const address = await connectWallet();
              const contract = await TOKEN_CONTRACT(transferTokenData.tokenAdd);

              const _availableBal = await contract.balanceOf(address)
              const availableToken = ethers.utils.formatEther(_availableBal.toString());

              if(availableToken > 1) {
                const payAmount = ethers.utils.parseUnits(
                    transferTokenData.amount.toString(),
                    "ether"
                );
                const transaction = await contract.transfer(
                    transferTokenData.address,
                    payAmount,
                    {
                        gasLimit: ethers.utils.hexlify(8000000)
                    }
                )
                await transaction.wait();
                setLoader(false)
                setReCall( reCall + 1);
                 setOpenTransferToken(false)
                 notifySuccess("Transaction completed successfully")
              }
              else {
                setLoader(false)
                setReCall( reCall + 1);
                 setOpenTransferToken(false)
                 notifyError("your balance is 0")
              }
            } catch (error) {
                setLoader(false)
                setReCall( reCall + 1);
                 setOpenTransferToken(false)
                 notifyError("something went wrong")
                console.log(error)
            }
        }


        const withdrawToken = async (widthdrawQuantity) => {
            try{
                if( !widthdrawQuantity.amount || !widthdrawQuantity.token) 
                    return notifyError("Data is missing");     
                
                
                const address = await connectWallet();
                const contract = await ICO_MARKETPLACE_CONTRACT();

                const payAmount = ethers.utils.parseUnits(
                 widthdrawQuantity.amount.toString(),
                 "ether"
                )
              
             const transaction = await contract.withdrawToken(
                 widthdrawQuantity.token,
                 payAmount, {
                    gasLimit: ethers.utils.hexlify(8000000)
                 }
             )
                 await transaction.wait()
                setLoader(true);
                setReCall(reCall + 1)
                setOpenWidthdrawToken(false)
                notifySuccess("Tranaction completed successfully")
            } catch (error) {
                setLoader(true);
                setReCall(reCall + 1)
                setOpenWidthdrawToken(false)
                notifyError("something went wrong")
                console.log(error)
            }
        }


         return <stateContext.Provider value={{ 
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
            
             PINATA_API_KEY,
             PINATA_SECRET_KEY,
             ICO_MARKETPLACE_ADDRESS,
             shortenAddress

            
             }}>{children}</stateContext.Provider>
     }


     export const useStateContext = () => useContext( stateContext);