import React, { useState } from 'react';
import { Entry } from '../types';
import { Plus, Trash2, RotateCcw, Shuffle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EntriesListProps {
  entries: Entry[];
  setEntries: (entries: Entry[]) => void;
  isSpinning: boolean;
}

export const EntriesList: React.FC<EntriesListProps> = ({ entries, setEntries, isSpinning }) => {
  const [inputValue, setInputValue] = useState('');

  const addEntry = () => {
    if (!inputValue.trim()) return;
    const newEntry: Entry = {
      id: Math.random().toString(36).substring(7),
      text: inputValue.trim(),
      weight: 1,
    };
    setEntries([...entries, newEntry]);
    setInputValue('');
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const shuffleEntries = () => {
    const shuffled = [...entries].sort(() => Math.random() - 0.5);
    setEntries(shuffled);
  };

  const clearEntries = () => {
    setEntries([]);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[24px] p-6 border border-[var(--border-natural)] shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif text-[var(--text-main)]">Variantlar</h2>
        <div className="flex gap-2">
          <button
            onClick={shuffleEntries}
            className="p-2 hover:bg-[var(--bg-natural)] rounded-lg transition-colors text-[var(--text-muted)]"
            title="Shuffle"
          >
            <Shuffle size={18} />
          </button>
          <button
            onClick={clearEntries}
            className="p-2 hover:bg-orange-50 rounded-lg transition-colors text-orange-400"
            title="Clear all"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addEntry()}
          placeholder="Yangi variant..."
          className="flex-1 px-4 py-2 rounded-xl border border-[var(--border-natural)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-sage)] bg-[var(--bg-natural)] text-sm"
          disabled={isSpinning}
        />
        <button
          onClick={addEntry}
          disabled={isSpinning || !inputValue.trim()}
          className="p-2 bg-[var(--accent-sage)] text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`group flex items-center justify-between p-3 rounded-xl border shadow-sm transition-all ${
                entry.text.toLowerCase().includes('xayotillo')
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-200 text-white animate-pulse shadow-orange-200'
                : 'bg-[var(--bg-natural)] border-[var(--border-natural)] border-l-4 border-l-[var(--accent-sand)] text-[var(--text-main)]'
              }`}
            >
              <span className={`font-medium truncate flex-1 mr-2 ${entry.text.toLowerCase().includes('xayotillo') ? 'text-white' : 'text-gray-700'}`}>
                {entry.text.toLowerCase().includes('xayotillo') && '👑 '}
                {entry.text}
              </span>
              <button
                onClick={() => removeEntry(entry.id)}
                disabled={isSpinning}
                className={`p-1 transition-colors ${entry.text.toLowerCase().includes('xayotillo') ? 'text-white/70 hover:text-white' : 'text-gray-300 hover:text-red-500'}`}
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {entries.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No entries yet.</p>
            <p className="text-sm">Add some to start spinning!</p>
          </div>
        )}
      </div>
    </div>
  );
};
