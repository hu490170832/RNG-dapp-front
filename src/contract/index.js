const web3 = require("web3");

const data = require("./normal.json");

const fs = require("fs");

const arr = data.map((item) => {
  if (web3.utils.checkAddressChecksum(item)) {
    return item;
  }
  return web3.utils.toChecksumAddress(item);
});

fs.writeFile("new.json", JSON.stringify(arr), function (err) {
  if (err) {
    return console.error(err);
  }
});
