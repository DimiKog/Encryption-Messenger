import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5001/api";

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
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-3">Encrypted Message Board</h2>
            <p className="text-sm text-slate-400 mb-3">
                You will see messages encrypted for you (to decrypt in ETH.Build) and messages you sent.
            </p>

            {filtered.length === 0 ? (
                <p className="text-center text-slate-500 text-sm">
                    No messages yet.
                </p>
            ) : (
                <div className="space-y-3">
                    {filtered.map((msg, idx) => (
                        <div
                            key={idx}
                            className="bg-slate-900/60 border border-slate-700 rounded-lg p-3"
                        >
                            <p className="text-xs text-slate-400 mb-1">
                                From:{" "}
                                <span className="font-mono">
                                    {msg.from.slice(0, 6)}...{msg.from.slice(-4)}
                                </span>{" "}
                                → To:{" "}
                                <span className="font-mono">
                                    {msg.to.slice(0, 6)}...{msg.to.slice(-4)}
                                </span>
                            </p>

                            <textarea
                                readOnly
                                className="w-full bg-slate-950 border border-slate-700 p-2 text-xs font-mono h-24"
                                value={msg.ciphertext}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MessageBoard;