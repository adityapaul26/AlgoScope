// src/pages/AdvancedTreesPage.jsx
import React from 'react';
import AVLTreeVisualizer from '../components/advancedTrees/AVLTreeVisualizer';
import TrieVisualizer from '../components/advancedTrees/TrieVisualizer';
import SegmentTreeVisualizer from '../components/advancedTrees/SegmentTreeVisualizer';

export default function AdvancedTreesPage() {
  return (
    <div className="flex flex-col gap-8 p-4 bg-slate-900/30 rounded-xl min-h-screen">
      <section className="bg-slate-800/50 rounded-lg p-4">
        <h2 className="text-xl font-bold text-cyan-300 mb-2">AVL Tree Visualizer</h2>
        <div className="h-96 w-full"><AVLTreeVisualizer /></div>
      </section>
      <section className="bg-slate-800/50 rounded-lg p-4">
        <h2 className="text-xl font-bold text-orange-300 mb-2">Trie Visualizer</h2>
        <div className="h-96 w-full"><TrieVisualizer /></div>
      </section>
      <section className="bg-slate-800/50 rounded-lg p-4">
        <h2 className="text-xl font-bold text-pink-300 mb-2">Segment Tree Visualizer</h2>
        <div className="h-96 w-full"><SegmentTreeVisualizer /></div>
      </section>
    </div>
  );
}
