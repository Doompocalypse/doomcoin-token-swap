// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CleopatraNecklaceNFT is ERC721, Ownable {
    uint256 public constant MAX_SUPPLY = 6;
    uint256 public constant PRICE = 10000 * 10**18; // 10,000 DMC tokens
    uint256 public constant ROYALTY_PERCENTAGE = 1000; // 10% in basis points
    
    IERC20 public doomCoinToken;
    string[] private tokenURIs;
    bool public isPublicMintEnabled;
    uint256 private _tokenIdCounter;
    
    mapping(uint256 => string) private _tokenURIMapping;
    
    event NFTMinted(address indexed to, uint256 indexed tokenId);
    event RoyaltyPaid(address indexed seller, address indexed buyer, uint256 amount);
    
    constructor(address _doomCoinAddress) ERC721("Cleopatra's Necklace", "DMCNFT1") Ownable(msg.sender) {
        doomCoinToken = IERC20(_doomCoinAddress);
        
        // Initialize token URIs
        tokenURIs = [
            "ipfs://bafkreif3zrdc4kmumzczujdbzkhmbpguq44lnwxu3zbakx4yqmf3jjd6gm",
            "ipfs://bafkreia5loihbnqqu4lhwxfwdqzqwypqgbdp43n4e53f2toim35kp4sqty",
            "ipfs://bafkreicfco2cqncwpfwbvzgqc3vt5sa3u52rn6r32jslmkzgxcswybx4gi",
            "ipfs://bafkreigmkxz4gh5aqn5t3pgsfpxb4j23ukcb5amxehjj7foizodtex5qpu",
            "ipfs://bafkreideuwx5k67dupir5p7fekvt7ey4bagkbizith6wex5szdxxgfgtbi",
            "ipfs://bafkreibxaidzoiqjwqz3xn5bjbh64kkiddjq2yqyemyo4nwuwzlpzqrnwe"
        ];
    }
    
    function togglePublicMint() external onlyOwner {
        isPublicMintEnabled = !isPublicMintEnabled;
    }
    
    function mint() external {
        require(isPublicMintEnabled, "Public minting is not enabled");
        require(_tokenIdCounter < MAX_SUPPLY, "Max supply reached");
        require(doomCoinToken.balanceOf(msg.sender) >= PRICE, "Insufficient DMC balance");
        require(doomCoinToken.allowance(msg.sender, address(this)) >= PRICE, "Insufficient DMC allowance");
        
        uint256 newTokenId = _tokenIdCounter + 1;
        
        // Transfer DMC tokens from buyer to contract
        doomCoinToken.transferFrom(msg.sender, address(this), PRICE);
        
        // Mint NFT
        _safeMint(msg.sender, newTokenId);
        _tokenURIMapping[newTokenId] = tokenURIs[_tokenIdCounter];
        _tokenIdCounter++;
        
        emit NFTMinted(msg.sender, newTokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenURIMapping[tokenId];
    }
    
    function withdrawDMC() external onlyOwner {
        uint256 balance = doomCoinToken.balanceOf(address(this));
        require(balance > 0, "No DMC to withdraw");
        doomCoinToken.transfer(owner(), balance);
    }
    
    function getRoyaltyInfo(uint256 salePrice) public pure returns (address receiver, uint256 royaltyAmount) {
        return (address(this), (salePrice * ROYALTY_PERCENTAGE) / 10000);
    }
    
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }
}