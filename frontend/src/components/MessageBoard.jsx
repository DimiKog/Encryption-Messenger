import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://dltlabs-api.dimikog.org/api";

const MessageBoard = ({ walletAddress }) => {
    const [messages, setMessages] = useState([]);

    const loadMessages = async () => {
        const res = await axios.get(`${API_BASE}/messages`);
        setMessages(res.data || []);
    };

    useEffect(() => {
        loadMessages();
    }, []);

    const filtered = messages.filter(
        (m) =>
            m.from.toLowerCase() === walletAddress.toLowerCase() ||
            m.to.toLowerCase() === walletAddress.toLowerCase()
    );

    return (
        <div className="glass-gold gold-border-soft rounded-2xl p-10 text-center space-y-8 max-w-xl mx-auto">
            <h2 className="text-3xl font-bold gold-text mb-4 tracking-wide">Encrypted Message Board</h2>
            <p className="text-sm gold-text-soft mb-6 max-w-xl mx-auto leading-relaxed">
                You will see messages encrypted for you (to decrypt in ETH.Build) and messages you sent.
            </p>

            {filtered.length === 0 ? (
                <p className="text-center gold-text-soft text-md font-medium py-6">
                    No messages yet.
                </p>
            ) : (
                <div className="space-y-3">
                    {filtered.map((msg, idx) => (
                        <div
                            key={idx}
                            className="rounded-2xl p-6 bg-black/40 backdrop-blur-md border border-yellow-500/30 shadow-lg transition-all duration-300 hover:bg-black/60"
                        >
                            <p className="text-xs text-yellow-300 mb-3 text-center space-x-2 tracking-wide">
                                <span className="gold-text">From:</span>
                                <span className="font-mono">{msg.from.slice(0, 6)}...{msg.from.slice(-4)}</span>
                                <span className="mx-2 text-slate-500">→</span>
                                <span className="gold-text">To:</span>
                                <span className="font-mono">{msg.to.slice(0, 6)}...{msg.to.slice(-4)}</span>
                            </p>

                            <textarea
                                readOnly
                                value={msg.ciphertext}
                                className="w-full px-3 py-2 bg-slate-900 text-white placeholder-slate-400 border border-slate-700 rounded-lg text-xs font-mono h-40 resize-none focus:outline-none focus:border-yellow-400 shadow-inner"
                            ></textarea>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MessageBoard;