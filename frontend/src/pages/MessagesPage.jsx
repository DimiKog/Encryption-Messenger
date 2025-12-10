import PublicKeyRegistry from "../components/PublicKeyRegistry";
import MessageBoard from "../components/MessageBoard";
import PostMessageForm from "../components/PostMessageForm";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const MessagesPage = () => {
    const [walletAddress, setWalletAddress] = useState("");

    useEffect(() => {
        const getAccount = async () => {
            if (!window.ethereum) return;

            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });

            if (accounts.length > 0) {
                setWalletAddress(ethers.getAddress(accounts[0]));
            }

            window.ethereum.on("accountsChanged", (newAccounts) => {
                if (newAccounts.length > 0) {
                    setWalletAddress(ethers.getAddress(newAccounts[0]));
                } else {
                    setWalletAddress("");
                }
            });
        };

        getAccount();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50">
            <main className="max-w-3xl mx-auto px-4 py-10 space-y-10">
                {/* Header */}
                <header className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Encrypted Messages Lab
                    </h1>
                    <p className="text-sm text-slate-400">
                        Use your Starter NFT wallet address to share public keys and encrypted messages.
                    </p>
                    {walletAddress ? (
                        <p className="text-xs text-emerald-400">
                            Connected wallet:{" "}
                            <span className="font-mono">
                                {walletAddress.slice(0, 6)}...
                                {walletAddress.slice(-4)}
                            </span>
                        </p>
                    ) : (
                        <p className="text-xs text-amber-400">
                            No wallet detected. Open MetaMask and refresh this page.
                        </p>
                    )}
                </header>

                {/* Public Key Registry */}
                <section className="bg-slate-900/80 border border-slate-700 rounded-xl shadow-md p-6 sm:p-8">
                    <PublicKeyRegistry walletAddress={walletAddress} />
                </section>

                {/* Send Encrypted Message */}
                <section className="bg-slate-900/80 border border-slate-700 rounded-xl shadow-md p-6 sm:p-8">
                    <PostMessageForm walletAddress={walletAddress} />
                </section>

                {/* Message Board */}
                <section className="bg-slate-900/80 border border-slate-700 rounded-xl shadow-md p-6 sm:p-8">
                    <MessageBoard walletAddress={walletAddress} />
                </section>
            </main>
        </div>
    );
};

export default MessagesPage;