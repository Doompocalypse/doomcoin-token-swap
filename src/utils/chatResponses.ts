export const generateResponse = (userInput: string): string => {
  console.log("Generating response for:", userInput);
  
  // Convert input to lowercase for easier matching
  const input = userInput.toLowerCase();
  
  // Wallet Connection Responses
  if (input.includes("connect") && input.includes("wallet")) {
    return "To connect your wallet, follow these steps:\n\n" +
           "1. Make sure you have MetaMask installed in your browser\n" +
           "2. Click the 'Connect Wallet' button in the top right corner\n" +
           "3. Select your MetaMask account\n" +
           "4. Approve the connection request\n\n" +
           "Would you like me to guide you through installing MetaMask if you don't have it yet?";
  }
  
  // Token Swap Responses
  if (input.includes("swap") || (input.includes("exchange") && input.includes("token"))) {
    return "Here's how to swap tokens:\n\n" +
           "1. Ensure your wallet is connected and has sufficient funds\n" +
           "2. Select the token you want to swap from\n" +
           "3. Select the token you want to receive\n" +
           "4. Enter the amount you want to swap\n" +
           "5. Review the exchange rate and gas fees\n" +
           "6. Click 'Swap' and confirm the transaction in your wallet\n\n" +
           "Would you like me to explain more about gas fees or slippage?";
  }
  
  // Price/Rate Checking
  if (input.includes("price") || input.includes("rate") || input.includes("value")) {
    return "I can help you check current token prices and exchange rates. Which tokens are you interested in?\n\n" +
           "I can show you:\n" +
           "• Real-time exchange rates\n" +
           "• Historical price data\n" +
           "• Price comparisons across different exchanges\n\n" +
           "Just let me know which specific tokens you'd like to compare!";
  }
  
  // Crypto Basics
  if (input.includes("what is") || input.includes("how does") || input.includes("explain") || input.includes("basics")) {
    if (input.includes("blockchain")) {
      return "A blockchain is a decentralized digital ledger that records transactions across a network of computers. Here's what makes it special:\n\n" +
             "• Immutable: Once recorded, data can't be changed\n" +
             "• Transparent: All transactions are public\n" +
             "• Secure: Uses advanced cryptography\n" +
             "• Decentralized: No single point of control\n\n" +
             "Would you like to learn more about how blockchain works or its real-world applications?";
    }
    if (input.includes("smart contract")) {
      return "Smart contracts are self-executing contracts with the terms directly written into code. They:\n\n" +
             "• Automatically execute when conditions are met\n" +
             "• Remove the need for intermediaries\n" +
             "• Are transparent and immutable\n" +
             "• Power many DeFi applications\n\n" +
             "Would you like to see some examples of smart contracts in action?";
    }
    return "I'd be happy to explain crypto concepts! Here are some topics I can help with:\n\n" +
           "• Blockchain technology\n" +
           "• Smart contracts\n" +
           "• DeFi (Decentralized Finance)\n" +
           "• NFTs\n" +
           "• Crypto wallets\n\n" +
           "Which topic interests you the most?";
  }
  
  // Gas and Fees
  if (input.includes("gas") || input.includes("fee")) {
    return "Gas fees are transaction costs on the Ethereum network. Here's what you need to know:\n\n" +
           "• Gas fees vary based on network congestion\n" +
           "• They're paid in ETH\n" +
           "• Higher gas fees = faster transactions\n" +
           "• You can set custom gas limits\n\n" +
           "Would you like to learn how to optimize your gas fees?";
  }

  // Security and Safety
  if (input.includes("safe") || input.includes("security") || input.includes("protect")) {
    return "Here are essential crypto security tips:\n\n" +
           "• Never share your private keys or seed phrase\n" +
           "• Use hardware wallets for large amounts\n" +
           "• Enable 2FA wherever possible\n" +
           "• Verify all transaction details carefully\n" +
           "• Be cautious of phishing attempts\n\n" +
           "Would you like more specific security advice?";
  }

  // Default response for unrecognized queries
  return "I'm here to help with anything related to:\n\n" +
         "• Wallet connections\n" +
         "• Token swaps\n" +
         "• Price checking\n" +
         "• Understanding crypto concepts\n" +
         "• Security best practices\n\n" +
         "Could you please rephrase your question or select one of these topics?";
};