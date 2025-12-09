import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5001/api";

const PublicKeyRegistry = ({ walletAddress }) => {
    const [publicKeys, setPublicKeys] = useState([]);
    const [nickname, setNickname] = useState("");
    const [publicKey, setPublicKey] = useState("");
    const [loading, setLoading] = useState(false);

    const loadKeys = async () => {
        const res = await axios.get(`${API_BASE}/public-keys`);
        setPublicKeys(res.data || []);
    };

    useEffect(() => {
        loadKeys();
    }, []);

    const submitKey = async () => {
        if (!walletAddress || !publicKey) return;

        setLoading(true);
        await axios.post(`${API_BASE}/public-keys`, {
            address: walletAddress,
            public_key: publicKey,
            nickname,
        });
        setPublicKey("");
        setNickname("");
        await loadKeys();
        setLoading(false);
    };

    return (
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-3">Public Key Registry</h2>

            {/* Submit Form */}
            <div className="space-y-3 mb-6">
                <p className="text-sm text-slate-400">
                    Submit the public key you generated in ETH.Build to allow others to encrypt messages for you.
                </p>

                <input
                    type="text"
                    placeholder="Nickname (optional)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />

                <textarea
                    placeholder="Paste your public key here"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm h-20"
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                />

                <button
                    onClick={submitKey}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50"
                >
                    {loading ? "Submitting..." : "Submit Public Key"}
                </button>
            </div>

            {/* Public Key Table */}
            <div>
                <h3 className="font-semibold text-sm mb-2">Registered Keys</h3>

                <div className="overflow-x-auto border border-slate-700 rounded-lg">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-900/60 border-b border-slate-700">
                            <tr>
                                <th className="px-3 py-2 text-left">Nickname</th>
                                <th className="px-3 py-2 text-left">Address</th>
                                <th className="px-3 py-2">Public Key</th>
                            </tr>
                        </thead>

                        <tbody>
                            {publicKeys.map((pk, idx) => (
                                <tr key={idx} className="border-b border-slate-700/50">
                                    <td className="px-3 py-2">{pk.nickname || "-"}</td>
                                    <td className="px-3 py-2 font-mono">
                                        {pk.address.slice(0, 6)}...{pk.address.slice(-4)}
                                    </td>
                                    <td className="px-3 py-2 font-mono break-all">{pk.public_key}</td>
                                </tr>
                            ))}

                            {publicKeys.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-3 py-4 text-center text-slate-500">
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