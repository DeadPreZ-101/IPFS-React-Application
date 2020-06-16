import React, { Component } from "react";
import { addingFile, retrieveFile } from "./blockchain/web3";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient("https://ipfs.infura.io:5001");

class App extends Component {
  state = {
    storageValue: "",
    buffer: null,
    loading: "",
    receivedAddress: null,
  };

  captureFile = (event) => {
    event.preventDefault();

    console.log(event.target.files[0]);
    const file = event.target.files[0];
    console.log(file);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("Buffer", this.state.buffer);
    };
  };

  onSubmit = async (event) => {
    event.preventDefault();

    console.log("Image has been submitted");

    this.setState({
      loading:
        "Your image is currently being uploaded... Please wait a few seconds (Duration depends on the size of the image).",
    });

    var hash = "";
    for await (const result of ipfs.add(this.state.buffer)) {
      console.log(result);
      hash = result.path;
      const receipt = addingFile(hash);
      receipt
        .then((res) => alert("Image is added to the blockchain"))
        .catch((res) => alert(res));
    }
    console.log("Image Hash: ", hash);
    this.setState({ storageValue: hash, loading: "" });
  };

  getFile = async (event) => {
    event.preventDefault();
    const address = event.target.value;
    console.log(address);
    const tx = await retrieveFile(address);
    console.log(tx);

    this.setState({ receivedAddress: tx });
  };

  render() {
    const receivedAddress = this.state.receivedAddress;
    return (
      <div className="Container">
        <nav className="navbar navbar-light bg-light">
          <h1 className="navbar-brand mb-0 h1 text-center">
            Simple IPFS Web Application
          </h1>
        </nav>
        <main role="main" className="inner cover mx-sm-3 mb-2 ">
          {this.state.storageValue !== "" ? (
            <img
              src={`https://ipfs.io/ipfs/${this.state.storageValue}`}
              alt="No-images"
            />
          ) : (
            <i>There is no image</i>
          )}
          <p>{this.state.loading === "" ? "" : this.state.loading}</p>

          <div className="card">
            <div className="card-body">
              <form onSubmit={this.onSubmit} className="form-inline mTop">
                <input
                  type="file"
                  className="form-control no-border"
                  onChange={this.captureFile}
                />
                <input
                  type="submit"
                  className="btn mx-sm-3 btn-primary bnt-sm form-control"
                />
              </form>
              {// // This will always show the hash of the uploaded image
              }
              {/* <p>
                This is the hash of the image:{" "}
                {this.state.storageValue === "" ? (
                  <i>Please upload an image to get the hash</i>
                ) : (
                  this.state.storageValue
                )}
              </p> */}
            </div>
          </div>

          <input type=" text " onChange={this.getFile} />
          {receivedAddress != null ? ( " The hash of the uploaded from this address is: " +
            receivedAddress
          ) : (
            <i> Enter your wallet address to see the hash of the image!</i>
          )}
        </main>
      </div>
    );
  }
}


export default App;
