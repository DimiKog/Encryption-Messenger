import { useState } from "react";
import axios from "axios";

const API_BASE = "https://dltlabs-api.dimikog.org/api";

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
        <div className="glass-gold gold-border-soft rounded-2xl p-8 text-center space-y-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold gold-text mb-4 tracking-wide">Send Encrypted Message</h2>
            <p className="text-sm gold-text-soft mb-3 max-w-xl mx-auto">
                Encrypt your message in ETH.Build then paste the ciphertext here.
            </p>

            <input
                type="text"
                placeholder="Recipient Address"
                className="w-full gold-input text-sm mb-4"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
            />

            <textarea
                placeholder="Encrypted message (ciphertext)"
                className="w-full gold-input text-sm font-mono h-36 resize-none"
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