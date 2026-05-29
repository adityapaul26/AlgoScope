// src/components/advancedTrees/BinaryTreeWithTrie.jsx
import React, { useState } from 'react';
import AVLTreeVisualizer from './AVLTreeVisualizer';
import TrieVisualizer from './TrieVisualizer';

export default function BinaryTreeWithTrie() {
  const [mode, setMode] = useState('AVL'); // 'AVL' or 'Trie'

  return (
    <div className="flex flex-col gap-8 p-4 bg-slate-900/30 rounded-xl min-h-screen">
      <section className="flex justify-center gap-4">
        <button
          onClick={() => setMode('AVL')}
          className={`px-4 py-2 rounded ${mode === 'AVL' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-gray-300'} transition`}
        >
          AVL Tree
        </button>
        <button
          onClick={() => setMode('Trie')}
          className={`px-4 py-2 rounded ${mode === 'Trie' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-gray-300'} transition`}
        >
          Trie
        </button>
      </section>
      {mode === 'AVL' && (
        <section className="bg-slate-800/50 rounded-lg p-4">
          <h2 className="text-xl font-bold text-cyan-300 mb-2">AVL Tree Visualizer</h2>
          <AVLTreeVisualizer />
        </section>
      )}
      {mode === 'Trie' && (
        <section className="bg-slate-800/50 rounded-lg p-4">
          <h2 className="text-xl font-bold text-emerald-300 mb-2">Trie Visualizer</h2>
          <TrieVisualizer />
        </section>
      )}
    </div>
  );
}
