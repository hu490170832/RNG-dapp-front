pragma solidity ^0.8.7;
import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract RNG is ERC721A, Ownable, ReentrancyGuard {
    uint256 public constant MAX_SUPPLY = 8888;
    uint256 public constant WL1NORMAL_PRICE = 0.05 ether;
    uint256 public constant WL2DISCOUNT_PRICE = 0.03 ether;
    uint256 public constant PUB_PRICE = 0.07 ether;
    uint256 public constant WL1NORMAL_LIMIT = 2;
    uint256 public constant WL2DISCOUNT_LIMIT = 1;
    uint256 public constant WL3FM_LIMIT = 1;
    uint256 public constant PUB_LIMIT = 3;

    uint256 public constant WL1NORMAL_MAX_SUPPLY = 6914;
    uint256 public constant WL2DISCOUNT_MAX_SUPPLY = 30;
    uint256 public constant WL3FM_MAX_SUPPLY = 56;

    uint256 public constant WL_SaleTime = 1673755200;
    uint256 public constant PUB_SaleTime = 1673841600;

    uint256 public minteds1 = 0;
    uint256 public minteds2 = 0;
    uint256 public minteds3 = 0;
    uint256 public minteds4 = 0;

    string public baseTokenURI;
    address public metaDataAddress;

    mapping(address => uint256) public minteds1Map;
    mapping(address => uint256) public minteds2Map;
    mapping(address => uint256) public minteds3Map;
    mapping(address => uint256) public minteds4Map;

    mapping(address => bool) public disapprovedMarketplaces;

    bytes32 public root1 =
        0xb240e0df5857b3b2dd115ba31687273ee44638716f1020125d23da1040f692eb;
    bytes32 public root2 =
        0xb240e0df5857b3b2dd115ba31687273ee44638716f1020125d23da1040f692eb;
    bytes32 public root3 =
        0xb240e0df5857b3b2dd115ba31687273ee44638716f1020125d23da1040f692eb;

    constructor(string memory _baseTokenUri) ERC721A("RNG", "RNG") {
        baseTokenURI = _baseTokenUri;
    }

    function WL1NORMAL_MINT(uint256 amount, bytes32[] memory proof)
        external
        payable
    {
        require(
            isWhiteLists1(proof, keccak256(abi.encodePacked(msg.sender))),
            "not WL1"
        );
        require(msg.value >= amount * WL1NORMAL_PRICE, "value low");
        require(
            minteds1Map[msg.sender] + amount <= WL1NORMAL_LIMIT,
            "Limit exceeded"
        );
        require(minteds1 + amount <= WL1NORMAL_MAX_SUPPLY, "Sold out!");
        require(block.timestamp >= WL_SaleTime, "Not on WL sale");
        unchecked {
            minteds1Map[msg.sender] += amount;
            minteds1 += amount;
        }

        _mint(msg.sender, amount);
    }

    function WL2DISCOUNT_MINT(uint256 amount, bytes32[] memory proof)
        external
        payable
    {
        require(
            isWhiteLists2(proof, keccak256(abi.encodePacked(msg.sender))),
            "not WL2"
        );
        require(msg.value >= amount * WL2DISCOUNT_PRICE, "value low");
        require(
            minteds2Map[msg.sender] + amount <= WL2DISCOUNT_LIMIT,
            "Limit exceeded"
        );
        require(minteds2 + amount <= WL2DISCOUNT_MAX_SUPPLY, "Sold out!");
        require(block.timestamp >= WL_SaleTime, "Not on WL sale");
        unchecked {
            minteds2Map[msg.sender] += amount;
            minteds2 += amount;
        }

        _mint(msg.sender, amount);
    }

    function WL3FM_MINT(uint256 amount, bytes32[] memory proof) external {
        require(
            isWhiteLists3(proof, keccak256(abi.encodePacked(msg.sender))),
            "not WL3"
        );
        require(minteds3 + amount <= WL3FM_MAX_SUPPLY, "Sold out!");
        require(
            minteds3Map[msg.sender] + amount <= WL3FM_LIMIT,
            "Limit exceeded"
        );
        require(block.timestamp >= WL_SaleTime, "Not on WL sale");
        unchecked {
            minteds3Map[msg.sender] += amount;
            minteds3 += amount;
        }

        _mint(msg.sender, amount);
    }

    function PUB_MINT(uint256 amount) external payable {
        require(totalSupply() + amount <= MAX_SUPPLY, "Sold out!");
        require(
            minteds4Map[msg.sender] + amount <= PUB_LIMIT,
            "Limit exceeded"
        );
        require(msg.value >= amount * PUB_PRICE, "value low");

        require(block.timestamp >= PUB_SaleTime, "Not on WL sale");
        unchecked {
            minteds4Map[msg.sender] += amount;
            minteds4 += amount;
        }

        _mint(msg.sender, amount);
    }

    function isWhiteLists1(bytes32[] memory proof, bytes32 leaf)
        public
        view
        returns (bool)
    {
        return MerkleProof.verify(proof, root1, leaf);
    }

    function isWhiteLists2(bytes32[] memory proof, bytes32 leaf)
        public
        view
        returns (bool)
    {
        return MerkleProof.verify(proof, root2, leaf);
    }

    function isWhiteLists3(bytes32[] memory proof, bytes32 leaf)
        public
        view
        returns (bool)
    {
        return MerkleProof.verify(proof, root3, leaf);
    }

    receive() external payable {}

    function ownerMint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Sold out!");
        _mint(to, amount);
    }

    function setBaseTokenURI(string calldata _uri) external onlyOwner {
        baseTokenURI = _uri;
    }

    function setMetadata(address _address) external onlyOwner {
        metaDataAddress = _address;
    }

    function setDisapprovedMarketplace(address market, bool isDisapprove)
        external
        onlyOwner
    {
        disapprovedMarketplaces[market] = isDisapprove;
    }

    function approve(address to, uint256 tokenId)
        public
        payable
        virtual
        override
    {
        require(!disapprovedMarketplaces[to], "The address is not approved");
        super.approve(to, tokenId);
    }

    function setApprovalForAll(address operator, bool approved)
        public
        virtual
        override
    {
        require(
            !disapprovedMarketplaces[operator],
            "The address is not approved"
        );
        super.setApprovalForAll(operator, approved);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        string memory baseURI = _baseURI();
        string memory _tokenUri = IMeataData(metaDataAddress).getMetadata(
            tokenId
        );
        return bytes(baseURI).length != 0 ? _tokenUri : "";
    }

    function _startTokenId() internal pure override returns (uint256) {
        return 1;
    }

    function withdraw() public payable onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success);
    }
}

interface IMeataData {
    function getMetadata(uint256 tokenId) external view returns (string memory);
}

contract RNGMetadata {
    constructor() {}

    function getMetadata(uint256 _tokenId)
        external
        pure
        returns (string memory)
    {
        string memory results = string(
            abi.encodePacked("data:application/json;base64,=")
        );
        return results;
    }
}
