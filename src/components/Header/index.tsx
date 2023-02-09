import Button from "@mui/material/Button";
import hiddenString from "@u/hiddenString";
import DIOS from "./logo.png";
import wallet from "./wallet.png";
import "./index.less";

interface Iprops {
  handleConnect: Function;
  currentAccount: string;
  setOpen: Function;
  isOpen: boolean;
}

export default function App(props: Iprops) {
  return (
    <div className="app_header">
      <div className="app_header_content">
        RNG
        <div className="app_header_buttons">
          <Button
            variant="contained"
            className="Claim"
            onClick={() => {
              window.open("https://opensea.io/");
            }}
          >
            OPENSEA
          </Button>
          {props.currentAccount ? (
            <span className="address">
              {hiddenString(props.currentAccount, 3, 4, 4)}
            </span>
          ) : (
            <Button
              className="wallet"
              onClick={() => {
                props.handleConnect();
              }}
            >
              <img src={wallet} alt="" className="Group" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
