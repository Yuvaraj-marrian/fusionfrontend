import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

function Questions() {
  const [ownership, setOwnership] = useState('');
  const [slacked, setSlacked] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ownership, slacked }),
      });
      if (response.ok) {
        alert('Submitted successfully!');
        setOwnership('');
        setSlacked('');
      } else {
        alert('Failed to submit');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error connecting to server');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
      <h2>Questions</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>1. One thing you took ownership</label>
          <textarea
            value={ownership}
            onChange={e => setOwnership(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', minHeight: '100px', borderRadius: '8px', border: '1px solid #ccc' }}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>2. 1 thing you slacked off</label>
          <textarea
            value={slacked}
            onChange={e => setSlacked(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', minHeight: '100px', borderRadius: '8px', border: '1px solid #ccc' }}
            required
          />
        </div>
        <button type="submit" style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
          Submit
        </button>
      </form>

    </div>
  );
}

function Game() {
  const [thoughts, setThoughts] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ intrusiveThoughts: thoughts }),
      });
      if (response.ok) {
        alert('Submitted successfully!');
        setThoughts('');
      } else {
        alert('Failed to submit');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error connecting to server');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
      <h2>Game</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Tell me your intrusive thoughts</label>
          <textarea
            value={thoughts}
            onChange={e => setThoughts(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', minHeight: '100px', borderRadius: '8px', border: '1px solid #ccc' }}
            required
          />
        </div>
        <button type="submit" style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
          Submit
        </button>
      </form>

    </div>
  );
}

function Results() {
  const [questions, setQuestions] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const qRes = await fetch('http://localhost:5000/api/questions');
        const qData = await qRes.json();

        const gRes = await fetch('http://localhost:5000/api/game');
        const gData = await gRes.json();

        setQuestions(qData);
        setGames(gData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading results...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Results Dashboard</h2>
        <Link to="/" style={{ color: '#646cff', textDecoration: 'none', fontWeight: 'bold' }}>Home</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <div>
          <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>Questions Submissions</h3>
          {questions.length === 0 ? <p>No questions submitted yet.</p> : questions.map((q, i) => (
            <div key={i} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', backgroundColor: '#f9f9f9', color: '#333' }}>
              <p style={{ margin: '0 0 0.5rem 0' }}><strong>Ownership:</strong> {q.ownership}</p>
              <p style={{ margin: 0 }}><strong>Slacked:</strong> {q.slacked}</p>
            </div>
          ))}
        </div>

        <div>
          <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>Game Submissions</h3>
          {games.length === 0 ? <p>No game thoughts submitted yet.</p> : games.map((g, i) => (
            <div key={i} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', backgroundColor: '#f9f9f9', color: '#333' }}>
              <p style={{ margin: 0 }}><strong>Intrusive Thoughts:</strong> {g.intrusiveThoughts}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VotingQ() {
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

function VoteResults() {
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

  const resultMap = {};
  const optionNameMap = {};

  if (options) {
    options.forEach(o => optionNameMap[o.id] = o.name);
  }

  if (results) {
    results.forEach(r => {
      resultMap[r._id] = r.votes.map(v => ({
        name: optionNameMap[v.optionId] || v.optionId,
        count: v.count
      })).sort((a, b) => b.count - a.count);
    });
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Voting Results</h2>
        <Link to="/" style={{ padding: '0.5rem 1rem', backgroundColor: '#1a1a1a', color: 'white', textDecoration: 'none', borderRadius: '8px' }}>Home</Link>
      </div>

      {questions && questions.map((q) => (
        <div key={q.id || q} style={{ border: '1px solid #e0e0e0', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', color: '#333' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>{q.text || q}</h3>
          {resultMap[q.id || q] ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {resultMap[q.id || q].map((vote, vIdx) => (
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
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            {/* <h1>Welcome</h1> */}
            {/* <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
              <Link to="/questions" style={{ padding: '1rem 2rem', backgroundColor: '#1a1a1a', color: 'white', textDecoration: 'none', borderRadius: '8px' }}>Go to Questions</Link>
              <Link to="/game" style={{ padding: '1rem 2rem', backgroundColor: '#1a1a1a', color: 'white', textDecoration: 'none', borderRadius: '8px' }}>Go to Game</Link>
              <Link to="/voting" style={{ padding: '1rem 2rem', backgroundColor: '#e91e63', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Start Office Voting</Link>
              <Link to="/results" style={{ padding: '1rem 2rem', backgroundColor: '#646cff', color: 'white', textDecoration: 'none', borderRadius: '8px' }}>View Results</Link>
            </div> */}
          </div>
        } />
        <Route path="/questions" element={<Questions />} />
        <Route path="/game" element={<Game />} />
        <Route path="/results" element={<Results />} />
        <Route path="/voting" element={<VotingQ />} />
        <Route path="/vote-results" element={<VoteResults />} />
      </Routes>
    </Router>
  );
}

export default App;
