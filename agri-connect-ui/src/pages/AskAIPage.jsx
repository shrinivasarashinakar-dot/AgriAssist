import React, { useState } from 'react';
import { askAI } from '../services/api';
import { Link } from 'react-router-dom';

const AskAIPage = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAsk = async (e) => {
    e.preventDefault();
    setError('');
    setAnswer('');
    const q = question.trim();
    if (!q) {
      setError('Please enter your question.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await askAI(q);
      setAnswer(data?.answer || 'No answer received.');
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-100 py-8">
      <div className="container-app">
        <div className="card card-hover p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-extrabold text-green-800">Ask your queries to AI</h1>
            <Link to="/dashboard" className="text-green-700 hover:underline">← Back to Dashboard</Link>
          </div>

          <form onSubmit={handleAsk} className="space-y-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your farming question here (e.g., pest control advice for cotton, fertilizer schedule for wheat, etc.)"
              className="textarea"
            />
            <button type="submit" disabled={loading} className="btn-primary px-4 py-2 disabled:opacity-60">
              {loading ? 'Asking…' : 'Ask AI'}
            </button>
          </form>

          {error && <div className="alert-error mt-4">{error}</div>}
          {answer && (
            <div className="card-soft mt-4 p-4 whitespace-pre-wrap text-green-900">
              {answer}
            </div>
          )}

          <p className="mt-6 text-sm text-slate-500">
            Note: AI answers may be inaccurate. Please verify critical decisions with an agricultural expert or local extension service.
          </p>
        </div>
      </div>
    </div>
  );
}
;

export default AskAIPage;
