import DDL from "@c/DeadLine";
import Button from "@mui/material/Button";

import web3 from "web3";
import moment from "moment";

import titleLine from "@/static/title.png";
import hiddenString from "@/utils/hiddenString";
import { getProof } from "@u/handleMerkleTree";

import { CHAIN_ID, CHAIN_NAME } from "@/constants";

import "swiper/swiper-bundle.css";
import "./index.less";

interface Iprops {
  currentAccount: string;
  contract: any;
  isMobile: Boolean;
  setMessage: Function;
  setCounts: Function;
  counts: Array<number>;
  checkeds: Array<boolean>;
  prices: Array<number>;
  supplys: Array<number>;
  item: any;
  index: number;
  deadline: string;
}

export default function App({
  item,
  currentAccount,
  counts,
  index,
  setCounts,
  isMobile,
  deadline,
  checkeds,
  prices,
  supplys,
  setMessage,
  contract,
}: Iprops) {
  const handleMint = async (index: number) => {
    let proof;
    if (!window.ethereum) {
      return setMessage({
        type: "error",
        text: `You're not in the dapp environment`,
        open: true,
      });
    }

    if (Number(window.ethereum?.networkVersion) !== Number(CHAIN_ID)) {
      return setMessage({
        type: "error",
        text: `Please switch ${CHAIN_NAME}  network`,
        open: true,
      });
    }

    if (!currentAccount) {
      return setMessage({
        type: "error",
        text: `Please connect wallet`,
        open: true,
      });
    }

    if (moment(moment.now()).isBefore(item.deadline)) {
      return setMessage({
        type: "error",
        text: `It's not time yet`,
        open: true,
      });
    }

    if (index !== 3) {
      proof = getProof(currentAccount, index);
      console.log(proof, "proof");
      if (proof?.length === 0) {
        return setMessage({
          type: "error",
          text: `You are not allowed to mint`,
          open: true,
        });
      }
    }

    try {
      let res;
      if (index === 0) {
        res = await contract.WL1NORMAL_MINT(counts[index], proof, {
          value: web3.utils.toWei(`${prices[index]}`, "ether"),
        });
      }
      if (index === 1) {
        res = await contract.WL2DISCOUNT_MINT(counts[index], proof, {
          value: web3.utils.toWei(`${prices[index]}`, "ether"),
        });
      }
      if (index === 2) {
        res = await contract.WL3FM_MINT(counts[index], proof);
      }
      if (index === 3) {
        res = await contract.PUB_MINT(counts[index], {
          value: web3.utils.toWei(`${prices[index]}`, "ether"),
        });
      }

      if (res) {
        return setMessage({
          type: "success",
          text: `Transaction submited`,
          open: true,
        });
      }
    } catch (e) {
      console.error(e);
      return setMessage({
        type: "error",
        text: `Mint failed`,
        open: true,
      });
    }
  };

  return (
    <div className="dapp_container">
      <div className="container_title">
        <div className="title">{item.title}</div>
        <div className="img_box">
          <img src={titleLine} alt="" />
        </div>
      </div>
      <div className="container_main">
        <div className="main_content">
          <div className="left">
            <img src={item.img} alt="" />
          </div>
          <div className="right">
            {isMobile ? null : <DDL deadline={deadline} />}
            <div className="white_list">
              <div className="address">
                <div className="label">Wallet address</div>
                <div className="value">
                  {currentAccount ? hiddenString(currentAccount, 8, 4, 4) : "-"}
                </div>
              </div>
              <div className="checked_container">
                {checkeds[index] ? (
                  <Button variant="contained" color="success">
                    Checked
                  </Button>
                ) : (
                  <Button variant="contained" color="error">
                    UnChecked
                  </Button>
                )}
              </div>
            </div>
            <div className="mint_container">
              <div className="mint_info">
                <div className="mint_item">
                  <span className="name">Price</span>
                  <span className="value">{prices[index]}&nbsp;Ξ</span>
                </div>
                <div className="mint_item">
                  <span className="name">Limit</span>
                  <span className="value">{item.limit} per Account</span>
                </div>
                <div className="count_buttons">
                  <span
                    className="but"
                    color="success"
                    onClick={() => {
                      if (counts[index] - 1 <= 0) {
                        return;
                      }
                      const arr = [...counts];
                      arr[index] = arr[index] - 1;
                      setCounts(arr);
                    }}
                  >
                    <span className="but_text">-</span>
                  </span>
                  <span className="count">{counts[index]}</span>
                  <span
                    className="but"
                    color="success"
                    onClick={() => {
                      if (counts[index] + 1 > item.limit) {
                        return;
                      }
                      const arr = [...counts];
                      arr[index] = arr[index] + 1;
                      setCounts(arr);
                    }}
                  >
                    <span className="but_text">+</span>
                  </span>
                </div>
              </div>

              <div className="operation"></div>
            </div>
          </div>
        </div>
        <div className="mint_button_container">
          <Button
            variant="contained"
            className="mint_but"
            onClick={() => {
              handleMint(index);
            }}
          >
            Mint
          </Button>
        </div>
        <div className="suplly_container">
          <span className="name">Supply&nbsp;&nbsp;&nbsp;</span>
          <span className="value">
            {index === 0 ? supplys[index] + 888 : supplys[index]}/{item.total}
          </span>
        </div>
      </div>
      {isMobile ? null : (
        <span className="introduce">
          You can claim a RNG pfp NFT for free by owning this NFT
        </span>
      )}
    </div>
  );
}
