import { CHAIN_ID, CHAIN_NAME } from "@/constants";

export function handleNetworkNotMatch(networkId, setMessage) {
  const res = Number(networkId) === Number(CHAIN_ID);
  if (!res) {
    setMessage({
      type: "warning",
      text: `Please switch ${CHAIN_NAME}  network`,
      open: true,
    });
  } else {
    setMessage({
      type: "success",
      text: `You successfully switched to the ${CHAIN_NAME}  network`,
      open: true,
    });
  }
}
