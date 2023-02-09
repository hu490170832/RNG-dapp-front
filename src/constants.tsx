import NFT1 from "@/static/nft.gif";
import moment from "moment";

export const CONTRACT_ADDRESS =
  process.env.NODE_ENV === "development"
    ? "0xdf7aed46f3ad848cc283e99e191b899533257cd6"
    : "0xdf7aed46f3ad848cc283e99e191b899533257cd6";

export const CHAIN_ID = process.env.NODE_ENV === "development" ? 5 : 5;

export const CHAIN_NAME =
  process.env.NODE_ENV === "development" ? "Goerli" : "Goerli";

export const URL =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8545"
    : "https://goerli.infura.io/v3";

export const CHAIN_COIN =
  process.env.NODE_ENV === "development" ? "ETH" : "ETH";

export const CHAIN_COIN_Decimal =
  process.env.NODE_ENV === "development" ? 18 : 18;

export const initPrices = [0.05, 0.03, 0, 0.07];

export const WL_DATA = [
  {
    title: "Normal Wl Round - 1",
    subTitle: "Sale Status",
    deadline: moment
      .utc("2023-1-15 12:00.00")
      .local()
      .format("YYYY-MM-DD HH:mm:ss"),
    price: 0.05,
    limit: 2,
    total: 7910,
    img: NFT1,
  },
  {
    title: "Discount Wl Round - 2",
    subTitle: "Sale Status",
    deadline: moment
      .utc("2023-1-15 12:00.00")
      .local()
      .format("YYYY-MM-DD HH:mm:ss"),
    price: 0.03,
    limit: 1,
    total: 30,
    img: NFT1,
  },
  {
    title: "Free Wl Round - 3",
    subTitle: "Sale Status",
    deadline: moment
      .utc("2023-1-15 12:00.00")
      .local()
      .format("YYYY-MM-DD HH:mm:ss"),
    price: 0,
    limit: 1,
    total: 60,
    img: NFT1,
  },
];

export const PUBLIC_DATA = {
  title: "Public",
  subTitle: "Sale Status",
  deadline: moment
    .utc("2023-1-16 12:00.00")
    .local()
    .format("YYYY-MM-DD HH:mm:ss"),
  price: 0.07,
  limit: 3,
  total: 1000,
  img: NFT1,
};
