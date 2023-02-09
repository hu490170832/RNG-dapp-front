import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import normalAddress from "@/contract/normal.json";
import discountAddress from "@/contract/discount.json";
import freemintAddress from "@/contract/freemint.json";

const normalNodes = normalAddress.map((addr) => keccak256(addr));
const discountNodes = discountAddress.map((addr) => keccak256(addr));
const freeNodes = freemintAddress.map((addr) => keccak256(addr));

const normalTree = new MerkleTree(normalNodes, keccak256, {
  sortPairs: true,
});

const discountTree = new MerkleTree(discountNodes, keccak256, {
  sortPairs: true,
});

const freemerkleTree = new MerkleTree(freeNodes, keccak256, {
  sortPairs: true,
});

const normalRoothash = normalTree.getRoot().toString("hex");
const discountRoothash = discountTree.getRoot().toString("hex");
const freeRoothash = freemerkleTree.getRoot().toString("hex");

console.log(normalRoothash, discountRoothash, freeRoothash);


export function addressHaveHexProof(address, type) {
  let result;
  if (type === 0) {
    result = normalTree.getHexProof(keccak256(address));
  }
  if (type === 1) {
    result = discountTree.getHexProof(keccak256(address));
  }
  if (type === 2) {
    result = freemerkleTree.getHexProof(keccak256(address));
  }
  return result.length > 0;
}

export function getProof(address, type) {
  let result;
  if (type === 0) {
    result = normalTree.getHexProof(keccak256(address));
  }
  if (type === 1) {
    result = discountTree.getHexProof(keccak256(address));
  }
  if (type === 2) {
    result = freemerkleTree.getHexProof(keccak256(address));
  }
  return result;
}
