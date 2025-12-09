// frontend/src/components/AccessGate.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const STARTER_NFT_ADDRESS = "0xD0151f0535454Ee5Fe0C3B64F98E8Be9Ff50970E";

const STARTER_NFT_ABI = [
    "function balanceOf(address owner) view returns (uint256)"
];

const AccessGate = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState(null);
    const [hasAccess, setHasAccess] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState("");
    const [isMetamaskAvailable, setIsMetamaskAvailable] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && window.ethereum) {
            setIsMetamaskAvailable(true);

            // If already connected, grab existing account
            window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
                if (accounts && accounts.length > 0) {
                    handleAccountsChanged(accounts);
                }
            });

            // Listen for account changes
            window.ethereum.on("accountsChanged", handleAccountsChanged);
        } else {
            setIsMetamaskAvailable(false);
        }

        return () => {
            if (window.ethereum && window.ethereum.removeListener) {
                window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAccountsChanged = async (accounts) => {
        if (!accounts || accounts.length === 0) {
            setWalletAddress(null);
            setHasAccess(false);
            return;
        }

        const addr = ethers.getAddress(accounts[0]);
        setWalletAddress(addr);
        setError("");
        await checkAccess(addr);
    };

    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                setError("MetaMask not detected. Please install it first.");
                return;
            }

            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            await handleAccountsChanged(accounts);
        } catch (err) {
            console.error(err);
            setError("Wallet connection rejected or failed.");
        }
    };

    const checkAccess = async (addr) => {
        try {
            setIsChecking(true);
            setError("");

            if (!window.ethereum) {
                setError("No Ethereum provider found.");
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(
                STARTER_NFT_ADDRESS,
                STARTER_NFT_ABI,
                provider
            );

            const balance = await contract.balanceOf(addr);
            // ethers v6 returns BigInt
            const hasNft = balance > 0n;

            setHasAccess(hasNft);
        } catch (err) {
            console.error(err);
            setError("Error while checking NFT balance. Check network & contract.");
            setHasAccess(false);
        } finally {
            setIsChecking(false);
        }
    };

    // ───────────────── UI ─────────────────
    if (!isMetamaskAvailable) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
                <div className="max-w-md w-full bg-slate-800/80 rounded-xl p-6 shadow-lg border border-slate-700">
                    <h1 className="text-2xl font-semibold mb-3 text-center">
                        Encrypted Messages DApp
                    </h1>
                    <p className="text-sm text-slate-300 mb-4 text-center">
                        To access the lab, you need a Web3 wallet (MetaMask) connected to
                        the Besu network and the Starter NFT.
                    </p>
                    <p className="text-sm text-rose-300 text-center">
                        MetaMask was not detected in your browser.
                    </p>
                </div>
            </div>
        );
    }

    if (!walletAddress) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
                <div className="max-w-md w-full bg-slate-800/80 rounded-xl p-6 shadow-lg border border-slate-700">
                    <h1 className="text-2xl font-semibold mb-3 text-center">
                        Encrypted Messages DApp
                    </h1>
                    <p className="text-sm text-slate-300 mb-4 text-center">
                        Connect your wallet to verify ownership of the Starter NFT and enter
                        the lab environment.
                    </p>
                    <button
                        onClick={connectWallet}
                        className="w-full py-2.5 rounded-lg font-medium bg-emerald-500 hover:bg-emerald-400 transition-colors"
                    >
                        Connect Wallet
                    </button>
                    {error && (
                        <p className="mt-3 text-sm text-rose-300 text-center">{error}</p>
                    )}
                </div>
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
                <div className="max-w-md w-full bg-slate-800/80 rounded-xl p-6 shadow-lg border border-slate-700">
                    <h1 className="text-xl font-semibold mb-3 text-center">
                        Access Restricted
                    </h1>
                    <p className="text-sm text-slate-300 mb-3 text-center break-words">
                        Connected wallet:
                        <br />
                        <span className="font-mono text-xs">{walletAddress}</span>
                    </p>
                    <p className="text-sm text-slate-300 mb-4 text-center">
                        This wallet does not hold the Starter NFT:
                        <br />
                        <span className="font-mono text-xs block mt-1">
                            {STARTER_NFT_ADDRESS}
                        </span>
                    </p>
                    <button
                        onClick={() => checkAccess(walletAddress)}
                        disabled={isChecking}
                        className="w-full py-2.5 rounded-lg font-medium bg-slate-700 hover:bg-slate-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                        {isChecking ? "Re-checking access..." : "Re-check NFT balance"}
                    </button>
                    {error && (
                        <p className="mt-3 text-sm text-rose-300 text-center">{error}</p>
                    )}
                </div>
            </div>
        );
    }

    // ✅ Access granted → render the actual app (public key registry + message board)
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold">
                            Encrypted Messages Lab 🧪
                        </h1>
                        <p className="text-xs text-slate-400">
                            Access granted — Starter NFT detected.
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">
                            Connected wallet
                        </p>
                        <p className="font-mono text-xs">
                            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-6">
                {children}
            </main>
        </div>
    );
};

export default AccessGate;