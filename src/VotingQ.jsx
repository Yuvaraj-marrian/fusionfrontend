import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const VotingQ = () => {
    const [questions, setQuestions] = useState([]);
    const [options, setOptions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/voting/config');
                if (!res.ok) {
                    throw new Error(`Server returned status: ${res.status}`);
                }
                const data = await res.json();

                if (!data || !data.questions) {
                    setErrorMsg("Invalid data received from backend.");
                    setLoading(false);
                    return;
                }

                setQuestions(data.questions);
                setOptions(data.options || []);

                const answeredMap = JSON.parse(localStorage.getItem('answeredVotesMap') || '{}');
                let firstUnansweredIndex = 0;
                let foundUnanswered = false;
                for (let i = 0; i < data.questions.length; i++) {
                    const qId = data.questions[i].id || data.questions[i];
                    if (!answeredMap[qId]) {
                        firstUnansweredIndex = i;
                        foundUnanswered = true;
                        break;
                    }
                }

                if (!foundUnanswered && data.questions.length > 0) {
                    setCurrentIndex(data.questions.length);
                } else {
                    setCurrentIndex(firstUnansweredIndex);
                }
            } catch (err) {
                console.error("Error fetching config", err);
                setErrorMsg(err.message || "Failed to fetch from backend");
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleVote = async (optionId) => {
        if (!questions[currentIndex]) return;
        const questionId = questions[currentIndex].id || questions[currentIndex];

        try {
            await fetch('http://localhost:5000/api/voting/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questionId, optionId })
            });

            const answeredMap = JSON.parse(localStorage.getItem('answeredVotesMap') || '{}');
            answeredMap[questionId] = optionId;
            localStorage.setItem('answeredVotesMap', JSON.stringify(answeredMap));

            setCurrentIndex(currentIndex + 1);
        } catch (err) {
            console.error("Error submitting vote", err);
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}><h2>Loading...</h2></div>;

    if (errorMsg) return (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
            <h2>Error Connecting to Backend</h2>
            <p>{errorMsg}</p>
            <p>Please make sure your Node backend is running on port 5000.</p>
        </div>
    );

    if (!questions || questions.length === 0) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>No questions available.</div>;
    }

    if (currentIndex >= questions.length) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Thank you for voting!</h2>

            </div>
        );
    }

    const currentQ = questions[currentIndex];

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ color: '#888', marginBottom: '0.5rem' }}>Question {currentIndex + 1} of {questions.length}</h2>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>{currentQ?.text || currentQ}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
                {options.map((opt, i) => (
                    <button
                        key={opt.id || i}
                        onClick={() => handleVote(opt.id || opt)}
                        style={{
                            padding: '1rem', cursor: 'pointer', borderRadius: '8px',
                            border: '1px solid #ccc', backgroundColor: '#f9f9f9',
                            fontWeight: 'bold', transition: 'background-color 0.2s',
                            color: '#333'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#e0e0e0'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#f9f9f9'}
                    >
                        {opt.name || opt}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default VotingQ;