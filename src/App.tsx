import Home from "./router/home";
import Header from "@c/Header";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ethers } from "ethers";

import { connectWalletHandler } from "@/utils/connect";
import { CHAIN_ID, CONTRACT_ADDRESS, CHAIN_NAME } from "@/constants";
import { checktNetworkChain } from "@u/connect";
import { handleNetworkNotMatch } from "@/utils/handleNetwork";
import abi from "@/contract/abi.json";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isTargetNetwork, setIsTargetNetwork] = useState(false);
  const [contract, setContract] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [tab, setValue] = useState(0);
  const [message, setMessage] = useState({
    type: "error",
    text: "",
    open: false,
  });

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    if (window.innerWidth < 768) {
      setIsMobile(true);
    }
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const res = Number(window.ethereum?.networkVersion) === Number(CHAIN_ID);
    if (!res) {
      setMessage({
        type: "warning",
        text: `Please switch ${CHAIN_NAME}  network`,
        open: true,
      });
      checktNetworkChain();
    }
    setIsTargetNetwork(res);
    (async () => {
      await handleConnect();
      window.ethereum?.on("accountsChanged", handleAccountsChange);
      window.ethereum?.on("chainChanged", handleNetworkChanged);
    })();
    return () => {};
  }, []);

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  const handleNetworkChanged = (newNetwork, oldNetwork) => {
    const res = Number(newNetwork) === Number(CHAIN_ID);
    handleNetworkNotMatch(newNetwork, setMessage);
    setIsTargetNetwork(res);
    handleConnect();
  };

  const handleAccountsChange = (accounts: Array<string>) => {
    if (accounts?.length > 0) {
      setCurrentAccount(accounts[0]);
    } else {
      setCurrentAccount("");
    }
  };

  const handleConnect = async () => {
    try {
      const account = await connectWalletHandler();
      if (account) {
        setCurrentAccount(account);
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );

        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
        setContract(contract);
      }
    } catch (e) {
      console.error(e, "handleConnect error");
    }
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setMessage({
      ...message,
      open: false,
    });
  };

  return (
    <div className="app">
      <Snackbar
        open={message.open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          //@ts-ignore
          severity={message.type}
          sx={{ width: "100%" }}
        >
          {message.text}
        </Alert>
      </Snackbar>
      <Header
        handleConnect={handleConnect}
        currentAccount={currentAccount}
        setOpen={setOpen}
        isOpen={isOpen}
      />
      <div className="app_content">
        {isMobile ? null : (
          <div className="tabs_container">
            <ButtonGroup
              variant="contained"
              aria-label="outlined primary button group"
            >
              <Button
                className={tab === 0 ? "But_active tab_but" : "tab_but"}
                onClick={() => {
                  setValue(0);
                }}
              >
                WL MINT
              </Button>
              <Button
                className={tab === 1 ? "But_active tab_but" : "tab_but"}
                onClick={() => {
                  setValue(1);
                }}
              >
                PUBLIC MINT
              </Button>
            </ButtonGroup>
          </div>
        )}

        <Routes>
          <Route
            path="/*"
            element={
              <Home
                currentAccount={currentAccount}
                handleConnect={handleConnect}
                isTargetNetwork={isTargetNetwork}
                contract={contract}
                isMobile={isMobile}
                tab={tab}
                setMessage={setMessage}
              />
            }
          ></Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
