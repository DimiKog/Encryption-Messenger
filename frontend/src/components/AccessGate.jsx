import { useEffect, useState } from "react";
import { ethers } from "ethers";
import web3eduLogo from "../assets/web3edu-logo.jpg";
import dimiIcon from "../assets/dimi.webp";

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
            //User must connect wallet first

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
            <div className="min-h-screen flex items-center justify-center gold-animated-bg text-white">
                <div className="max-w-md w-full glass-gold gold-border-soft rounded-2xl p-8 text-center space-y-4">
                    <h1 className="text-3xl font-bold gold-text mb-4 tracking-wide">
                        Encrypted Messages DApp
                    </h1>
                    <p className="text-sm gold-text-soft mb-4 max-w-sm mx-auto">
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
            <div className="min-h-screen w-full flex items-center justify-center bg-[#070B14] text-slate-100 px-6">
                <div className="text-center max-w-xl">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-4">
                        Encrypted Messages
                        <span className="block text-3xl font-semibold mt-2 text-emerald-300">
                            DApp
                        </span>
                    </h1>

                    <p className="text-slate-400 text-lg leading-relaxed mb-10">
                        Connect your wallet to verify ownership of the Starter NFT and
                        enter the secure blockchain messaging environment.
                    </p>

                    <button
                        onClick={connectWallet}
                        className="
                            bg-emerald-400 text-slate-900 
                            font-semibold px-8 py-3 rounded-xl 
                            shadow-lg shadow-emerald-400/20 
                            hover:bg-emerald-300 hover:shadow-emerald-300/30
                            transition-all duration-200
                        "
                    >
                        Connect Wallet
                    </button>

                    {error && (
                        <p className="mt-6 text-sm text-rose-400">{error}</p>
                    )}
                </div>
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div className="min-h-screen flex items-center justify-center gold-animated-bg text-white">
                <div className="max-w-md w-full glass-gold gold-border-soft rounded-2xl p-8 text-center space-y-5">
                    <h1 className="text-2xl font-bold gold-text mb-4 tracking-wide">
                        Access Restricted
                    </h1>
                    <p className="text-sm gold-text-soft max-w-sm mx-auto break-words">
                        Connected wallet:
                        <br />
                        <span className="font-mono text-xs">{walletAddress}</span>
                    </p>
                    <p className="text-sm gold-text-soft max-w-sm mx-auto break-words">
                        This wallet does not hold the Starter NFT:
                        <br />
                        <span className="font-mono text-xs block mt-1">
                            {STARTER_NFT_ADDRESS}
                        </span>
                    </p>
                    <button
                        onClick={() => checkAccess(walletAddress)}
                        disabled={isChecking}
                        className="w-full gold-button disabled:opacity-40 disabled:cursor-not-allowed"
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
        <div className="min-h-screen gold-animated-bg text-white flex flex-col items-center">
            <header className="border-b border-yellow-600/30 bg-black/40 backdrop-blur-md w-full flex justify-center py-4">
                <div className="w-full max-w-2xl px-4 flex flex-col items-center text-center space-y-2">
                    <h1 className="text-3xl font-extrabold gold-text tracking-wide flex items-center gap-3 justify-center">
                        <img
                            src={web3eduLogo}
                            alt="Web3Edu Logo"
                            className="w-14 h-14 opacity-90 drop-shadow-lg select-none"
                        />
                        Encrypted Messages Lab <span className="text-amber-300">🧪</span>
                    </h1>

                    <p className="text-xs gold-text-soft">
                        Access granted — Starter NFT detected.
                    </p>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                        Connected wallet
                    </p>
                    <p className="font-mono text-xs bg-black/40 border border-yellow-600/40 px-3 py-1.5 rounded-lg gold-text-soft">
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </p>
                </div>
            </header>

            <main className="w-full flex justify-center px-4 py-10">
                <div className="max-w-xl w-full mx-auto flex flex-col items-center space-y-12">
                    {children}
                </div>
            </main>

            <footer className="w-full py-6 text-center text-xs text-white/70 flex flex-col items-center">
                <div className="flex items-center gap-2">
                    <img
                        src={dimiIcon}
                        alt="Dimitris"
                        className="w-6 h-6 rounded-full opacity-70 hover:opacity-100 transition"
                    />
                    <p>© {new Date().getFullYear()} <a href="https://dimikog.org" target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:text-emerald-200 transition">Dimitrios G. Kogias</a> — Web3Edu</p>
                </div>

                <p className="text-white/60 mt-1">All rights reserved.</p>
                <p className="text-white/50 mt-1">Version 1.0.0</p>
            </footer>
        </div>
    );
};

export default AccessGate;