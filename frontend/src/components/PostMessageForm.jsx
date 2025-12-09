import { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5001/api";

const PostMessageForm = ({ walletAddress }) => {
    const [recipient, setRecipient] = useState("");
    const [ciphertext, setCiphertext] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!recipient || !ciphertext) return;

        setLoading(true);
        await axios.post(`${API_BASE}/messages`, {
            from: walletAddress,
            to: recipient,
            ciphertext,
        });

        setRecipient("");
        setCiphertext("");
        setLoading(false);
    };

    return (
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-3">Send Encrypted Message</h2>
            <p className="text-sm text-slate-400 mb-3">
                Encrypt your message in ETH.Build then paste the ciphertext here.
            </p>

            <input
                type="text"
                placeholder="Recipient Address"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm mb-3"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
            />

            <textarea
                placeholder="Encrypted message (ciphertext)"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm h-24 mb-3 font-mono"
                value={ciphertext}
                onChange={(e) => setCiphertext(e.target.value)}
            />

            <button
                onClick={sendMessage}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 disabled:opacity-50"
            >
                {loading ? "Sending..." : "Send Message"}
            </button>
        </div>
    );
};

export default PostMessageForm;