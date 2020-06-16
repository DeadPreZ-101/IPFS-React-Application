import React, { Component } from "react";
import "./App.css";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient("https://ipfs.infura.io:5001");

class App extends Component {
  state = {
    storageValue: "QmWiEZ4ayDi46FtCz24CtzH7D1putEXD3jSFSLD7sjAt93",
    buffer: null,
    loading: "",
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

    this.setState({ loading: "Your image is currently being uploaded... Please wait a few seconds (Duration depends on the size of the image)." });

    var hash = "";
    for await (const result of ipfs.add(this.state.buffer)) {
      console.log(result);
      hash = result.path;
    }
    console.log("Image Hash: ", hash);
    this.setState({ storageValue: hash, loading: "" });
  };

  const getFile = async (result) => {
    // event.preventDefault();
    // const result = event.target.value;
    await ipfs.files.get(result, (err, res) => {
      res.forEach((file) => {
        console.log("filepath", file.path);
        const filePath = file.path;
        const getImage = file.content.toString("utf8");
        console.log("file content => ", getImage);
        setReceivedFile(filePath);
      });
    });

    <img src={`https://ipfs.io/ipfs/${receivedFile}`} alt="No-images" />

  render() {
    return (
      <div className="Container">
        <nav className="navbar navbar-light bg-light">
          <h1 className="navbar-brand mb-0 h1 text-center">Simple IPFS Web Application</h1>
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
              <p>
                This is image hash:{" "}
                {this.state.storageValue === "" ? (
                  <i>Please Upload the image to see the hash</i>
                ) : (
                  this.state.storageValue
                )}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
