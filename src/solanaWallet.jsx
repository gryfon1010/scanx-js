import { useState, useEffect } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL, SystemProgram, Transaction } from '@solana/web3.js';

const SolanaWallet = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [publicKey, setPublicKey] = useState(null);
    const [balance, setBalance] = useState(null);
    const [recipientAddress, setRecipientAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState(null);
    const [txStatus, setTxStatus] = useState('');

    const connection = new Connection('https://api.mainnet-beta.solana.com');

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    const checkIfWalletIsConnected = async () => {
        try {
            const { solana } = window;

            if (solana) {
                if (solana.isPhantom) {
                    const response = await solana.connect({ onlyIfTrusted: true });
                    const publicKey = response.publicKey.toString();
                    setIsConnected(true);
                    setPublicKey(publicKey);
                    await getBalance(publicKey);
                }
            } else {
                setError('Solana object not found! Get Phantom Wallet 👻');
            }
        } catch (error) {
            console.error(error);
            setIsConnected(false);
        }
    };

    const connectWallet = async () => {
        try {
            const { solana } = window;

            if (solana) {
                const response = await solana.connect();
                const publicKey = response.publicKey.toString();
                setIsConnected(true);
                setPublicKey(publicKey);
                await getBalance(publicKey);
                setError(null);
            }
        } catch (error) {
            setError('Error connecting to wallet: ' + error.message);
        }
    };

    const getBalance = async (publicKey) => {
        try {
            const balance = await connection.getBalance(new PublicKey(publicKey));
            setBalance(balance / LAMPORTS_PER_SOL);
        } catch (error) {
            console.error('Error getting balance:', error);
            setError('Error getting balance: ' + error.message);
        }
    };

    const sendTransaction = async () => {
        try {
            if (!isConnected) {
                setError('Please connect your wallet first');
                return;
            }

            if (!recipientAddress || !amount) {
                setError('Please fill in both address and amount');
                return;
            }

            setTxStatus('Initiating transaction...');
            setError(null);

            const { solana } = window;
            
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: new PublicKey(publicKey),
                    toPubkey: new PublicKey(recipientAddress),
                    lamports: amount * LAMPORTS_PER_SOL,
                })
            );

            const signature = await solana.signAndSendTransaction(transaction);
            
            setTxStatus('Transaction sent! Waiting for confirmation...');
            
            const confirmation = await connection.confirmTransaction(signature.signature);
            
            if (confirmation) {
                setTxStatus('Transaction confirmed!');
                await getBalance(publicKey);
                setRecipientAddress('');
                setAmount('');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Transaction failed: ' + error.message);
            setTxStatus('');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Solana Wallet</h2>
            <div style={{ marginBottom: '10px' }}>
                Connection Status: {isConnected ? 'Connected' : 'Disconnected'}
            </div>

            {!isConnected && (
                <button
                    onClick={connectWallet}
                    style={{ padding: '10px', marginBottom: '10px' }}
                >
                    Connect Phantom Wallet
                </button>
            )}

            {error && (
                <div style={{ color: 'red', marginBottom: '10px' }}>
                    {error}
                </div>
            )}

            {isConnected && publicKey && (
                <div style={{ marginTop: '20px' }}>
                    <div>Address: {`${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`}</div>
                    <div>Balance: {balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}</div>

                    <div style={{ marginTop: '20px' }}>
                        <h3>Send SOL</h3>
                        <div style={{ marginBottom: '10px' }}>
                            <input
                                type="text"
                                placeholder="Recipient Address"
                                value={recipientAddress}
                                onChange={(e) => setRecipientAddress(e.target.value)}
                                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                            />
                            <input
                                type="number"
                                step="0.0001"
                                placeholder="Amount in SOL"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                            />
                            <button
                                onClick={sendTransaction}
                                style={{ padding: '10px', width: '100%' }}
                            >
                                Send SOL
                            </button>
                        </div>
                        {txStatus && (
                            <div style={{ marginTop: '10px' }}>
                                <p>{txStatus}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SolanaWallet;
