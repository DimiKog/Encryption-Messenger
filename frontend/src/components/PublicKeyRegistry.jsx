import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://dltlabs-api.dimikog.org/api";

const PublicKeyRegistry = ({ walletAddress }) => {
    const [publicKeys, setPublicKeys] = useState([]);
    const [nickname, setNickname] = useState("");
    const [publicKey, setPublicKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadKeys = async () => {
        try {
            const res = await axios.get(`${API_BASE}/public-keys`);
            console.log("API Response:", res.data); // 🔍 Debugging: Check console for this
            setPublicKeys(res.data || []);
        } catch (err) {
            console.error("Failed to load public keys", err);
            setError("Failed to load key list.");
        }
    };

    useEffect(() => {
        loadKeys();
    }, []);

    const submitKey = async () => {
        if (!walletAddress || !publicKey) return;

        setLoading(true);
        setError("");

        try {
            await axios.post(`${API_BASE}/public-keys`, {
                address: walletAddress,
                public_key: publicKey,
                nickname,
            });

            setPublicKey("");
            setNickname("");
            await loadKeys();
        } catch (err) {
            console.error("Failed to submit key:", err);
            setError("Could not submit key. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="glass-gold gold-border-soft rounded-2xl p-8 text-center space-y-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold gold-text mb-4 tracking-wide">
                Public Key Registry
            </h2>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="space-y-3 mb-6">
                <p className="text-sm gold-text-soft max-w-xl mx-auto">
                    Submit the public key you generated in ETH.Build to allow others to encrypt messages for you.
                </p>

                <input
                    type="text"
                    placeholder="Nickname (optional)"
                    className="w-full px-3 py-2 bg-slate-900 text-white placeholder-slate-400 border border-slate-700 rounded text-sm focus:outline-none focus:border-yellow-400"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />

                <textarea
                    placeholder="Paste your public key here"
                    className="w-full h-24 px-3 py-2 bg-slate-900 text-white placeholder-slate-400 border border-slate-700 rounded text-sm font-mono resize-none focus:outline-none focus:border-yellow-400"
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                />

                <button
                    onClick={submitKey}
                    disabled={loading}
                    className="gold-button"
                >
                    {loading ? "Submitting..." : "Submit Public Key"}
                </button>
            </div>

            <div>
                <h3 className="font-semibold text-lg gold-text-soft mb-3">Registered Keys</h3>

                <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-black via-zinc-900 to-black border border-amber-500 shadow-[0_0_25px_rgba(255,180,0,0.25)] p-2">
                    <table className="w-full text-sm text-white">
                        <thead className="bg-black/80 border-b border-amber-500">
                            <tr className="text-amber-300 text-left font-semibold">
                                <th className="px-4 py-3">Nickname</th>
                                <th className="px-4 py-3">Address</th>
                                <th className="px-4 py-3">Public Key</th>
                            </tr>
                        </thead>

                        <tbody>
                            {publicKeys.map((pk, idx) => (
                                <tr
                                    key={idx}
                                    className="hover:bg-zinc-800 transition-all border-b border-zinc-800/80"
                                >
                                    <td className="px-4 py-3 text-white font-medium">
                                        {pk.nickname || "-"}
                                    </td>

                                    <td className="px-4 py-3 font-mono text-white">
                                        {pk.address
                                            ? `${pk.address.slice(0, 6)}...${pk.address.slice(-4)}`
                                            : "Unknown"}
                                    </td>

                                    <td className="px-4 py-3 font-mono text-amber-200 break-all">
                                        {pk.public_key || "No Key Provided"}
                                    </td>
                                </tr>
                            ))}

                            {publicKeys.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="3"
                                        className="px-4 py-6 text-center text-zinc-300 italic"
                                    >
                                        No public keys submitted yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PublicKeyRegistry;