import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://dltlabs-api.dimikog.org/api";

const PostMessageForm = ({ walletAddress }) => {
    const [recipient, setRecipient] = useState("");
    const [recipients, setRecipients] = useState([]);
    const [ciphertext, setCiphertext] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRecipients = async () => {
            try {
                const res = await axios.get(`${API_BASE}/public-keys`);
                setRecipients(res.data || []);
            } catch (err) {
                console.error("Failed to load recipients", err);
            }
        };
        fetchRecipients();
    }, []);

    const sendMessage = async () => {
        if (!recipient || !ciphertext) return;

        if (recipient.toLowerCase() === walletAddress.toLowerCase()) {
            alert("You cannot send an encrypted message to yourself.");
            return;
        }

        const confirmed = window.confirm("Are you sure you want to send this encrypted message?");
        if (!confirmed) return;

        setLoading(true);
        await axios.post(`${API_BASE}/messages`, {
            from: walletAddress,
            to: recipient,
            ciphertext: ciphertext.trim(),
        });

        setRecipient("");
        setCiphertext("");
        setLoading(false);
    };

    return (
        <div className="glass-gold gold-border-soft rounded-2xl p-8 text-center space-y-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold gold-text mb-4 tracking-wide">Send Encrypted Message</h2>
            <p className="text-sm gold-text-soft mb-3 max-w-xl mx-auto">
                Encrypt your message in ETH.Build then paste the ciphertext here.
            </p>

            <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 text-white border border-slate-700 rounded text-sm focus:outline-none focus:border-yellow-400 mb-4"
            >
                <option value="">Select recipient</option>
                {recipients.map((entry) => (
                    <option key={entry.address} value={entry.address}>
                        {entry.nickname ? `${entry.nickname} — ${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`
                            : `${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`}
                    </option>
                ))}
            </select>

            <textarea
                placeholder="Encrypted message (ciphertext)"
                className="w-full px-3 py-2 bg-slate-900 text-white placeholder-slate-400 border border-slate-700 rounded text-sm font-mono h-36 resize-none focus:outline-none focus:border-yellow-400"
                value={ciphertext}
                onChange={(e) => setCiphertext(e.target.value)}
            />

            <button
                onClick={sendMessage}
                disabled={loading}
                className="gold-button disabled:opacity-50"
            >
                {loading ? "Sending..." : "Send Message"}
            </button>
        </div>
    );
};

export default PostMessageForm;