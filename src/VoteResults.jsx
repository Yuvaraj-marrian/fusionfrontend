import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const VoteResults = () => {
    const [resultsData, setResultsData] = useState({ results: [], questions: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/voting/results');
                const data = await res.json();
                setResultsData(data);
            } catch (err) {
                console.error("Error fetching results", err);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading results...</div>;

    const { results, questions, options } = resultsData;

    // Convert results array to a map for easy lookup
    const resultMap = {};
    const optionNameMap = {};

    if (options) {
        options.forEach(o => optionNameMap[o.id] = o.name);
    }

    results.forEach(r => {
        resultMap[r._id] = r.votes.map(v => ({
            name: optionNameMap[v.optionId] || v.optionId,
            count: v.count
        })).sort((a, b) => b.count - a.count);
    });

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Voting Results</h2>
                <Link to="/" style={{ padding: '0.5rem 1rem', backgroundColor: '#1a1a1a', color: 'white', textDecoration: 'none', borderRadius: '8px' }}>Home</Link>
            </div>

            {questions.map((q) => (
                <div key={q.id} style={{ border: '1px solid #e0e0e0', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', color: '#333' }}>
                    <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>{q.text}</h3>
                    {resultMap[q.id] ? (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {resultMap[q.id].map((vote, vIdx) => (
                                <li key={vIdx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: vIdx % 2 === 0 ? '#f9f9f9' : 'transparent', borderRadius: '4px' }}>
                                    <span style={{ fontWeight: vIdx === 0 ? 'bold' : 'normal', color: vIdx === 0 ? '#d32f2f' : 'inherit' }}>
                                        {vIdx === 0 && '🏆 '} {vote.name}
                                    </span>
                                    <span style={{ fontWeight: 'bold', color: '#646cff' }}>{vote.count} vote{vote.count > 1 ? 's' : ''}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ fontStyle: 'italic', color: '#888', margin: 0 }}>No votes yet.</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default VoteResults;
