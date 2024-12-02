import { useState, useEffect } from "react";
import { ethers } from "ethers";

/**
 * React component to connect to a MetaMask wallet and send cryptocurrency.
 *
 * Features:
 * - Connects to a MetaMask wallet
 * - Checks the connection status
 * - Gets the user's balance
 * - Allows the user to send cryptocurrency
 * - Allows the user to switch networks (Ethereum Mainnet, Sepolia Testnet)
 * - Allows the user to select the currency (ETH, SOL - coming soon)
 *
 * @returns {JSX.Element} The React component
 */
const MetaMask = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [userBalance, setUserBalance] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [chainId, setChainId] = useState(null);
    const [recipientAddress, setRecipientAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [txHash, setTxHash] = useState("");
    const [txStatus, setTxStatus] = useState("");
    const [selectedCurrency, setSelectedCurrency] = useState("ETH");
    const [selectedNetwork, setSelectedNetwork] = useState("ethereum");

    const SEPOLIA_CHAIN_ID = 11155111;

    // Check initial connection status
    useEffect(() => {
        checkConnection();
        setupEventListeners();
        return () => removeEventListeners();
    }, []);

    const checkConnection = async () => {
    
        if (typeof window.ethereum !== "undefined") {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_accounts"
                });

                if (accounts.length > 0) {
                    setIsConnected(true);
                    accountChanged(accounts[0]);
                    const chainIdHex = await window.ethereum.request({
                        method: "eth_chainId"
                    });
                    setChainId(parseInt(chainIdHex, 16));
                } else {
                    setIsConnected(false);
                    setDefaultAccount(null);
                    setUserBalance(null);
                }
            } catch (error) {
                console.error("Error checking connection:", error);
            }
        }
    };

    const setupEventListeners = () => {
        if (typeof window.ethereum !== "undefined") {
            window.ethereum.on("accountsChanged", handleAccountsChanged);
            window.ethereum.on("chainChanged", handleChainChanged);
            window.ethereum.on("disconnect", handleDisconnect);
        }
    };

    const removeEventListeners = () => {
        if (typeof window.ethereum !== "undefined") {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
            window.ethereum.removeListener("chainChanged", handleChainChanged);
            window.ethereum.removeListener("disconnect", handleDisconnect);
        }
    };

    const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
            // User disconnected their wallet
            setIsConnected(false);
            setDefaultAccount(null);
            setUserBalance(null);
            setErrorMessage("Please connect your MetaMask wallet.");
        } else {
            accountChanged(accounts[0]);
        }
    };

    const handleChainChanged = (chainIdHex) => {
        setChainId(parseInt(chainIdHex, 16));
        // Reload page to ensure all data is fresh for new chain
        window.location.reload();
    };

    const handleDisconnect = () => {
        setIsConnected(false);
        setDefaultAccount(null);
        setUserBalance(null);
        setErrorMessage("Wallet disconnected");
    };

    const connectWallet = async () => {
        setIsLoading(true);
        setErrorMessage(null);

        if (typeof window.ethereum !== "undefined") {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts"
                });
                setIsConnected(true);
                await accountChanged(accounts[0]);
            } catch (error) {
                if (error.code === 4001) {
                    setErrorMessage("You rejected the connection request");
                } else {
                    setErrorMessage("Could not connect to MetaMask: " + error.message);
                }
                setIsConnected(false);
            }
        } else {
            setErrorMessage("MetaMask is not detected. Please install MetaMask.");
        }
        setIsLoading(false);
    };

    const disconnectWallet = async () => {
        try {
            // Disconnect from MetaMask
            if (typeof window.ethereum !== "undefined") {
                // Clear any cached permissions
                await window.ethereum.request({
                    method: "wallet_revokePermissions",
                    params: [{
                        eth_accounts: {}
                    }]
                });
            }

            // Clear all states
            setIsConnected(false);
            setDefaultAccount(null);
            setUserBalance(null);
            setErrorMessage(null);
            setTxStatus("");
            setTxHash("");
            setRecipientAddress("");
            setAmount("");
            
            handleDisconnect();
        } catch (error) {
            console.error("Error disconnecting:", error);
            setErrorMessage("Error disconnecting wallet: " + error.message);
        }
    };

    const accountChanged = async (account) => {
        setDefaultAccount(account);
        await getAccountBalance(account);
    };

    const getAccountBalance = async (account) => {
        try {
            const balance = await window.ethereum.request({
                method: "eth_getBalance",
                params: [String(account), "latest"]
            });
            setUserBalance(ethers.formatEther(balance));
        } catch (error) {
            setErrorMessage("Error fetching balance: " + error.message);
        }
    };

    const getNetworkName = (chainId) => {
        const networks = {
            1: "Ethereum Mainnet",
            5: "Goerli Testnet",
            11155111: "Sepolia",
            137: "Polygon Mainnet",
            80001: "Mumbai Testnet"
        };
        return networks[chainId] || `Chain ID: ${chainId}`;
    };

    const formatAddress = (address) => {
        if (!address) return "";
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const switchNetwork = async (networkName) => {
        try {
            let params;
            switch(networkName) {
                case "ethereum":
                    params = [{
                        chainId: '0x1', // Ethereum Mainnet
                    }];
                    break;
                case "sepolia":
                    try {
                        // First try to switch to Sepolia
                        await window.ethereum.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
                        });
                    } catch (switchError) {
                        // This error code indicates that the chain has not been added to MetaMask
                        if (switchError.code === 4902) {
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [{
                                    chainId: '0xaa36a7',
                                    chainName: 'Sepolia Testnet',
                                    nativeCurrency: {
                                        name: 'Sepolia ETH',
                                        symbol: 'SEP',
                                        decimals: 18
                                    },
                                    rpcUrls: ['https://rpc.sepolia.org'],
                                    blockExplorerUrls: ['https://sepolia.etherscan.io']
                                }]
                            });
                        } else {
                            throw switchError;
                        }
                    }
                    return;
                default:
                    throw new Error("Unsupported network");
            }
            
            if (params) {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params
                });
            }
            setSelectedNetwork(networkName);
        } catch (error) {
            console.error("Error switching network:", error);
            setErrorMessage("Failed to switch network: " + error.message);
        }
    };

    const sendTransaction = async () => {
        if (!isConnected) {
            setErrorMessage("Please connect your wallet first");
            return;
        }

        if (chainId !== SEPOLIA_CHAIN_ID && selectedNetwork === "sepolia") {
            setErrorMessage("Please switch to Sepolia network first");
            await switchNetwork("sepolia");
            return;
        }

        if (!recipientAddress || !amount) {
            setErrorMessage("Please fill in both address and amount");
            return;
        }

        // Validate Ethereum address format
        if (!ethers.isAddress(recipientAddress)) {
            // Check if it might be a Solana address (base58 format, typically 32-44 chars)
            if (recipientAddress.length >= 32 && recipientAddress.length <= 44 && !recipientAddress.startsWith('0x')) {
                setErrorMessage("Error: You cannot send ETH to a Solana wallet address. Please use an Ethereum address starting with '0x'.");
                return;
            }
            setErrorMessage("Invalid Ethereum address. Address must start with '0x' and be 42 characters long.");
            return;
        }

        try {
            setTxStatus("Initiating transaction...");
            setErrorMessage(null);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const tx = await signer.sendTransaction({
                to: recipientAddress,
                value: ethers.parseEther(amount)
            });

            setTxStatus("Transaction sent! Waiting for confirmation...");
            setTxHash(tx.hash);

            const receipt = await tx.wait();
            if (receipt.status === 1) {
                setTxStatus("Transaction confirmed!");
                await getAccountBalance(defaultAccount);
                // Clear the form
                setRecipientAddress("");
                setAmount("");
            } else {
                setTxStatus("Transaction failed!");
            }
        } catch (error) {
            setErrorMessage(error.message);
            setTxStatus("");
        }
    };

    return (
        <div style={{ padding: "20px"}}>
            <h2>Wallet Connection</h2>
            <div style={{ marginBottom: "10px" }}>
                Connection Status: {isConnected ? "Connected" : "Disconnected"}
            </div>

            {!isConnected ? (
                <button
                    onClick={connectWallet}
                    disabled={isLoading}
                    style={{ padding: "10px", marginBottom: "10px" }}
                >
                    {isLoading ? "Connecting..." : "Connect Wallet"}
                </button>
            ) : (
                <button
                    onClick={disconnectWallet}
                    style={{ padding: "10px", marginBottom: "10px", backgroundColor: "#ff4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                    Disconnect Wallet
                </button>
            )}

            {isConnected && defaultAccount && (
                <div style={{ marginTop: "20px" }}>
                    <div>Network: {getNetworkName(chainId)}</div>
                    <div>Address: {formatAddress(defaultAccount)}</div>
                    <div>Balance: {userBalance ? `${Number(userBalance).toFixed(4)} ${selectedCurrency}` : "Loading..."}</div>

                    <div style={{ marginTop: "20px" }}>
                        <h3>Send Cryptocurrency</h3>
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", marginBottom: "10px" }}>Select Network:</label>
                            <select 
                                value={selectedNetwork}
                                onChange={(e) => switchNetwork(e.target.value)}
                                style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                            >
                                <option value="ethereum">Ethereum Mainnet</option>
                                <option value="sepolia">Sepolia Testnet</option>
                            </select>

                            <label style={{ display: "block", marginBottom: "10px" }}>Select Currency:</label>
                            <select 
                                value={selectedCurrency}
                                onChange={(e) => setSelectedCurrency(e.target.value)}
                                style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                            >
                                <option value="ETH">Ethereum (ETH)</option>
                                <option value="SOL" disabled>Solana (SOL) - Coming Soon</option>
                            </select>
                        </div>
                        <input
                            type="text"
                            placeholder="Recipient Address"
                            value={recipientAddress}
                            onChange={(e) => setRecipientAddress(e.target.value)}
                            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                        />
                        <input
                            type="number"
                            step="0.0001"
                            placeholder="Amount in cryptocurrency"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                        />
                        <button
                            onClick={sendTransaction}
                            style={{ padding: "10px", width: "100%" }}
                            disabled={chainId !== SEPOLIA_CHAIN_ID && selectedNetwork === "sepolia"}
                        >
                            Send Cryptocurrency
                        </button>
                        {txStatus && (
                            <div style={{ marginTop: "10px" }}>
                                <p>{txStatus}</p>
                                {txHash && (
                                    <a
                                        href={`https://sepolia.etherscan.io/tx/${txHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View on Sepolia Etherscan
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {errorMessage && (
                <div style={{ color: "red", marginTop: "10px" }}>
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default MetaMask;