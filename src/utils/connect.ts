import {
  CHAIN_ID,
  URL,
  CHAIN_NAME,
  CHAIN_COIN,
  CHAIN_COIN_Decimal,
} from "@/constants";

export const connectWalletHandler = async (): Promise<string> => {
  const { ethereum } = window;

  if (!ethereum) {
    // message.error("please install wallet!");
  }

  try {
    const accounts = await window.ethereum?.request({
      method: "eth_requestAccounts",
    });
    console.log("Found an account! Address: ", accounts[0]);
    return accounts[0];
  } catch (err) {
    console.error(err);
    return "";
  }
};

export const checktNetworkChain = async () => {
  if (document.hidden) {
    return;
  }

  const { ethereum } = window;

  if (!ethereum) {
    // message.warn("Make sure you have Metamask installed!");
    return false;
  }

  const accounts = await window?.ethereum?.request({ method: "eth_accounts" });
  if (accounts.length !== 0) {
    if (ethereum?.networkVersion !== String(CHAIN_ID)) {
      try {
        await window?.ethereum?.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
        });
      } catch (switchError: any) {
        console.log(switchError, "switchError");
        if (switchError.code === 4902) {
          try {
            await ethereum?.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${CHAIN_ID.toString(16)}`,
                  chainName: CHAIN_NAME,
                  rpcUrls: [URL],
                  nativeCurrency: {
                    name: CHAIN_COIN,
                    symbol: CHAIN_COIN,
                    decimals: CHAIN_COIN_Decimal,
                  },
                },
              ],
            });
          } catch (addError) {
            // message.error("add  network error");
            console.error(addError, "addError");
          }
        }
      }
    }
  } else {
    console.error("No authorized account found");
    return connectWalletHandler();
  }
};
