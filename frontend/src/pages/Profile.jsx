import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Profile() {
    const { currentUser, logout } = useAuth();
    const [skinType, setSkinType] = useState("");
    const [skinTone, setSkinTone] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            if (!currentUser) return;
            try {
                const token = await currentUser.getIdToken();
                const res = await axios.get("http://localhost:8000/users/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data) {
                    setSkinType(res.data.skin_type || "");
                    setSkinTone(res.data.skin_tone || "");
                }
            } catch (err) {
                console.error("Failed to fetch profile", err);
            }
            setLoading(false);
        }
        fetchProfile();
    }, [currentUser]);

    async function handleSave() {
        try {
            setMessage("");
            const token = await currentUser.getIdToken();
            await axios.post("http://localhost:8000/users/profile", {
                uid: currentUser.uid,
                email: currentUser.email,
                skin_type: skinType,
                skin_tone: skinTone
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage("Profile updated successfully!");
        } catch (err) {
            setMessage("Failed to update profile: " + err.message);
        }
    }

    async function handleLogout() {
        try {
            await logout();
        } catch (err) {
            console.error("Failed to log out", err);
        }
    }

    if (loading) return <div className="p-8 text-center text-zinc-400">Loading profile...</div>;

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 pb-20">
            <div className="max-w-md mx-auto">
                <h1 className="text-2xl font-bold mb-6">My Profile</h1>

                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 mb-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
                        <div className="text-lg">{currentUser.email}</div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Skin Type</label>
                        <select
                            value={skinType}
                            onChange={(e) => setSkinType(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded p-3 focus:outline-none focus:border-emerald-500"
                        >
                            <option value="">Select Skin Type</option>
                            <option value="Oily">Oily</option>
                            <option value="Dry">Dry</option>
                            <option value="Combination">Combination</option>
                            <option value="Sensitive">Sensitive</option>
                            <option value="Normal">Normal</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Skin Tone</label>
                        <select
                            value={skinTone}
                            onChange={(e) => setSkinTone(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded p-3 focus:outline-none focus:border-emerald-500"
                        >
                            <option value="">Select Skin Tone</option>
                            <option value="Fair">Fair</option>
                            <option value="Medium">Medium</option>
                            <option value="Dark">Dark</option>
                        </select>
                    </div>

                    {message && <div className="mb-4 text-emerald-400 text-sm">{message}</div>}

                    <button
                        onClick={handleSave}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded transition-all"
                    >
                        Save Profile
                    </button>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full bg-red-900/20 text-red-400 border border-red-900/50 font-bold py-3 rounded hover:bg-red-900/30 transition-all"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
}
