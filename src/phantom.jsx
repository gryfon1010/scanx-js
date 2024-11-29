// Import necessary React hooks for state management and side effects
import { useState, useEffect } from "react";
import { Connection, SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Define the Phantom wallet component
const Phantom = () => {
    // State to track wallet connection status
    const [isConnected, setIsConnected] = useState(false);
    // State to store the connected wallet's address
    const [walletAddress, setWalletAddress] = useState(null);
    // State to store the transaction status
    const [transactionStatus, setTransactionStatus] = useState("");
    const [response, setResponse] = useState(null);
    const [recipientAddress, setRecipientAddress] = useState("");
    const [amount, setAmount] = useState("");

    // useEffect hook to set up Phantom wallet event listeners
    useEffect(() => {
        if (window.solana) {
            const handleConnect = () => setIsConnected(true);
            const handleDisconnect = () => setIsConnected(false);
            
            window.solana.on("connect", handleConnect);
            window.solana.on("disconnect", handleDisconnect);
            
            // Cleanup function to remove event listeners
            return () => {
                window.solana.off("connect", handleConnect);
                window.solana.off("disconnect", handleDisconnect);
            };
        }
    }, []); // Empty dependency array means this runs once on component mount

    // Function to handle wallet connection
    const connectWallet = async () => {
        if (window.solana) {
            try {
                // Request connection to Phantom wallet
                const response = await window.solana.connect();
                // Store the wallet's public key
                setWalletAddress(response.publicKey.toString());
                // Update connection status
                setIsConnected(true);
                setResponse(response);
            } catch (err) {
                // Handle any connection errors
                console.error("Error connecting to Phantom Wallet:", err);
            }
        } else {
            // Alert user if Phantom wallet is not installed
            alert("Phantom Wallet not found. Please install it.");
        }
    };

    // Function to handle wallet disconnection
    const disconnectWallet = () => {
        if (window.solana) {
            // Disconnect from Phantom wallet
            window.solana.disconnect();
            // Reset connection status
            setIsConnected(false);
            // Clear stored wallet address
            setWalletAddress(null);
        }
    };

    // Function to handle transactions
    const sendTransaction = async (recipientAddress, amount) => {
        try {
            if (!isConnected || !window.solana) {
                throw new Error("Wallet not connected!");
            }

            // Convert recipient address string to PublicKey
            const toPublicKey = new PublicKey(recipientAddress);
            
            // Connect to Solana network (using devnet for testing)
            const connection = new Connection("https://api.devnet.solana.com", "confirmed");
            
            // Create a new transaction
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: new PublicKey(walletAddress),
                    toPubkey: toPublicKey,
                    lamports: amount * LAMPORTS_PER_SOL // Convert SOL to lamports
                })
            );

            // Get the latest blockhash
            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = new PublicKey(walletAddress);

            // Sign and send transaction
            const signed = await window.solana.signTransaction(transaction);
            const signature = await connection.sendRawTransaction(signed.serialize());
            
            // Wait for transaction confirmation
            await connection.confirmTransaction(signature);
            
            setTransactionStatus("Transaction successful!");
            return signature;
        } catch (error) {
            console.error("Transaction failed:", error);
            setTransactionStatus(`Transaction failed: ${error.message}`);
            throw error;
        }
    };

    // Render the component UI
    return (
        <div>
            {isConnected ? (
                // Show connected wallet info and disconnect button
                <div>
                    <p>Connected: {walletAddress}</p>
                    <button onClick={disconnectWallet}>Disconnect</button>
                    <input
                            type="text"
                            placeholder="Recipient Address"
                            value={recipientAddress}
                            onChange={(e) => setRecipientAddress(e.target.value)}
                            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                        />
                        <input
                            type="text"
                            placeholder="Amount (SOL)"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                        />
                    <button onClick={() => sendTransaction(recipientAddress, amount)}>Send Transaction</button>
                    <p>Transaction Status: {transactionStatus}</p>
                </div>
            ) : (
                // Show connect button when not connected
                <button onClick={connectWallet}>Connect to Phantom Wallet</button>
            )}
        </div>
    );
};

// Export the component for use in other parts of the application
export default Phantom;