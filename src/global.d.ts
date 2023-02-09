declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.bmp";
declare module "*.tiff";
declare module "*.module.less" {
  const classes: { [key: string]: string };
  export default classes;
}
interface Window {
  ethereum: import("ethers").providers.ExternalProvider & {
    networkVersion: string;
  } & { on: Function } & { request: Function };
}
declare module "*.json" {
  const value: any;
  export default value;
}
