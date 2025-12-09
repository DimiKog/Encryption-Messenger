import PublicKeyRegistry from "../components/PublicKeyRegistry";
import MessageBoard from "../components/MessageBoard";
import PostMessageForm from "../components/PostMessageForm";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const MessagesPage = () => {
    const [walletAddress, setWalletAddress] = useState("");

    useEffect(() => {
        const getAccount = async () => {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({
                    method: "eth_accounts",
                });
                if (accounts.length > 0) {
                    setWalletAddress(ethers.getAddress(accounts[0]));
                }
            }

            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    setWalletAddress(ethers.getAddress(accounts[0]));
                } else {
                    setWalletAddress("");
                }
            });
        };
        getAccount();
    }, []);

    return (
        <div className="space-y-6">
            <PublicKeyRegistry walletAddress={walletAddress} />
            <PostMessageForm walletAddress={walletAddress} />
            <MessageBoard walletAddress={walletAddress} />
        </div>
    );
};

export default MessagesPage;