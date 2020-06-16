import Web3 from "web3";
import ABI from "./ipfs.abi.json";
const CONTRACT_ADDRESS = "0xA9E0A3E76f8229B65694D3ce2F068f78FBba03Cd";
const web3 = new Web3("http://localhost:7545");
const IpfsContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

export const addingFile = async (ipfshash) => {
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);
  console.log(ipfshash);
  const receipt = await IpfsContract.methods
    .storeHash(ipfshash)
    .send({ from: accounts[0] });
  console.log(receipt);
};

export const retrieveFile = async (result) => {
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);
  const receipt = await IpfsContract.methods
    .retrieveAddr(result)
    .call({ from: accounts[0] });
  console.log(receipt);
  return receipt;
};
