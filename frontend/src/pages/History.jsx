import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Badge from '../components/Badge';

export default function History() {
    const { currentUser } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHistory() {
            if (!currentUser) return;
            try {
                const token = await currentUser.getIdToken();
                const res = await axios.get('http://localhost:8000/history', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHistory(res.data);
            } catch (err) {
                console.error("Failed to fetch history", err);
            }
            setLoading(false);
        }
        fetchHistory();
    }, [currentUser]);

    if (loading) return <div className="p-8 text-center text-zinc-500">Loading history...</div>;

    return (
        <div className="min-h-screen bg-background text-foreground p-4 pb-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Scan History</h1>

                {history.length === 0 ? (
                    <div className="text-center text-zinc-500 py-12 bg-zinc-900/50 rounded-xl border border-zinc-800">
                        <p>No scans yet. Go to Home to scan a product!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((item, index) => (
                            <Card key={index} className="hover:bg-zinc-900/80 transition-colors cursor-pointer">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-lg">{item.product_name || "Unknown Product"}</h3>
                                        <div className="text-sm text-zinc-500">{new Date(item.timestamp).toLocaleDateString()}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-2xl font-bold ${item.toxicity_score >= 0.6 ? 'text-red-500' : item.toxicity_score >= 0.3 ? 'text-yellow-500' : 'text-green-500'}`}>
                                            {Math.round(item.toxicity_score * 100)}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
