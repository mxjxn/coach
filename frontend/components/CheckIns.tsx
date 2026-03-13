'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

type Mood = 'great' | 'good' | 'okay' | 'struggling';

interface CheckIn {
  id: number;
  checkin_type: string;
  time: string;
  questions: string;
  responses: string;
  notes: string;
  created_at: string;
}

interface Question {
  id: number;
  question: string;
}

export function CheckIns() {
  const { isConnected } = useAccount();
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    checkin_type: 'general',
    mood: 'good' as Mood,
    notes: '',
    responses: {} as Record<number, string>
  });

  const questions: Question[] = [
    { id: 1, question: 'How are you feeling today?' },
    { id: 2, question: 'What did you accomplish?' },
    { id: 3, question: 'What are you working on?' },
    { id: 4, question: 'What\'s blocking you?' },
    { id: 5, question: 'How can I help?' }
  ];

  const fetchCheckins = async () => {
    try {
      const response = await fetch('/api/checkins');
      if (response.ok) {
        const data = await response.json();
        setCheckins(data);
      }
    } catch (error) {
      console.error('Error fetching check-ins:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchCheckins();
    } else {
      setLoading(false);
    }
  }, [isConnected]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkin_type: formData.checkin_type,
          time: new Date().toISOString(),
          questions: questions,
          responses: formData.responses,
          notes: `${formData.mood} mood. ${formData.notes}`
        }),
      });

      if (response.ok) {
        setShowForm(false);
        setFormData({ checkin_type: 'general', mood: 'good', notes: '', responses: {} });
        fetchCheckins();
      }
    } catch (error) {
      console.error('Error creating check-in:', error);
    }
  };

  const moodEmojis: Record<Mood, string> = {
    great: '😄',
    good: '🙂',
    okay: '😐',
    struggling: '😔',
  };

  const moodColors: Record<Mood, string> = {
    great: 'text-green-400',
    good: 'text-blue-400',
    okay: 'text-yellow-400',
    struggling: 'text-red-400',
  };

  if (!isConnected) {
    return (
      <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">Recent Check-ins</h2>
        <p className="text-gray-400">Connect your wallet to view your check-ins</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Recent Check-ins</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Check In'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-lg border border-gray-800 bg-gray-900 p-4">
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-300">How are you feeling?</label>
            <div className="flex gap-2">
              {(Object.keys(moodEmojis) as Mood[]).map((mood) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => setFormData({ ...formData, mood })}
                  className={`flex-1 rounded-lg border px-3 py-2 text-2xl transition-all ${
                    formData.mood === mood
                      ? 'border-blue-600 bg-blue-600/20'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  {moodEmojis[mood]}
                  <div className="text-xs capitalize text-gray-400">{mood}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 space-y-3">
            {questions.map((q) => (
              <div key={q.id}>
                <label className="mb-1 block text-sm font-medium text-gray-300">{q.question}</label>
                <textarea
                  value={formData.responses[q.id] || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    responses: { ...formData.responses, [q.id]: e.target.value }
                  })}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
                  rows={2}
                />
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-300">Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
              rows={2}
              placeholder="Anything else on your mind?"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Submit Check-in
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center text-gray-400">Loading check-ins...</div>
      ) : checkins.length === 0 ? (
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-8 text-center">
          <p className="text-gray-400">No check-ins yet. Start tracking your progress!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {checkins.map((checkin) => {
            const moodMatch = checkin.notes.match(/(great|good|okay|struggling) mood/);
            const mood = (moodMatch?.[1] || 'okay') as Mood;
            return (
              <div
                key={checkin.id}
                className="rounded-lg border border-gray-800 bg-gray-900 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {moodEmojis[mood]}
                      </span>
                      <span className={`text-sm font-medium capitalize ${moodColors[mood]}`}>
                        {mood}
                      </span>
                      <span className="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-300">
                        {checkin.checkin_type}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-400">{checkin.notes}</p>
                    <p className="mt-2 text-xs text-gray-500">
                      {new Date(checkin.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
