// src/components/advancedTrees/TrieVisualizer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Trie from '../../algorithms/trees/trie';
// import cloneDeep from 'lodash/cloneDeep';

// Position calculation similar to binary tree layout
const calculatePositions = (node, x, y, xOffset = 180) => {
  if (!node) return;
  node.x = x;
  node.y = y;
  const next = Math.max(xOffset / 1.8, 30);
  const children = Object.values(node.children);
  const mid = Math.floor(children.length / 2);
  children.forEach((child, i) => {
    const offset = (i - mid) * xOffset;
    calculatePositions(child, x + offset, y + 80, next);
  });
};

const getNodesAndEdges = (root) => {
  const nodes = [];
  const edges = [];
  const traverse = (node, parent) => {
    if (!node) return;
    nodes.push(node);
    if (parent) {
      edges.push({
        id: `${parent.id}-${node.id}`,
        x1: parent.x,
        y1: parent.y,
        x2: node.x,
        y2: node.y,
      });
    }
    for (const child of Object.values(node.children)) {
      traverse(child, node);
    }
  };
  traverse(root, null);
  return { nodes, edges };
};

export default function TrieVisualizer() {
  const [trie] = useState(new Trie());
  const [version, setVersion] = useState(0); // force re-render

  const [inputWord, setInputWord] = useState('');

  const [searchResult, setSearchResult] = useState(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const up = () => {
      if (containerRef.current) {
        setDimensions({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight });
      }
    };
    up();
    window.addEventListener('resize', up);
    return () => window.removeEventListener('resize', up);
  }, []);

  const handleInsert = () => {
    if (!inputWord) return;
    trie.insert(inputWord.trim());
    setVersion(v => v + 1);
    setInputWord('');
    setSearchResult(null);
  };

  const handleDelete = () => {
    if (!inputWord) return;
    const success = trie.delete(inputWord.trim());
    setVersion(v => v + 1);
    setInputWord('');
    setSearchResult(success ? 'Deleted' : 'Not found');
  };

  const handleSearch = () => {
    if (!inputWord) return;
    const found = trie.search(inputWord.trim());
    setSearchResult(found ? 'Found' : 'Not found');
    setInputWord('');
    // No need to re-render for search result only
  };
// eslint-disable-next-line react-hooks/exhaustive-deps
  const { nodes, edges } = React.useMemo(() => {
    if (!trie.root) return { nodes: [], edges: [] };
    const centerX = dimensions.width / 2;
    calculatePositions(trie.root, centerX, 50, Math.min(centerX / 2, 150));
    return getNodesAndEdges(trie.root);
  }, [trie, version, dimensions.width]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col gap-2 p-4 bg-slate-900/50 rounded-xl border border-white/5 mb-4">
        <p className="text-sm text-gray-300">Enter a word and click **Insert** to add it to the Trie. Use **Delete** to remove a word and **Search** to check its presence. The result appears below.</p>
        <div className="flex gap-4">
          <input
            value={inputWord}
            onChange={(e) => setInputWord(e.target.value)}
            placeholder="Word"
            className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:border-cyan-500 outline-none"
          />
          <button type="button" onClick={() => { console.log('Trie Insert clicked'); handleInsert(); }} className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-500 transition">Insert</button>
          <button type="button" onClick={() => { console.log('Trie Delete clicked'); handleDelete(); }} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition ml-2">Delete</button>
          <button type="button" onClick={() => { console.log('Trie Search clicked'); handleSearch(); }} className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 transition ml-2">Search</button>
        </div>
      </div>
      {searchResult && (
        <div className="p-2 text-center text-sm text-white bg-slate-800/70 rounded-b-xl">
          {searchResult}
        </div>
      )}
      <div ref={containerRef} className="relative flex-1 overflow-hidden bg-slate-900/30 backdrop-blur-sm rounded-xl border border-white/5">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {edges.map((e) => (
            <motion.line
              key={e.id}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              stroke="#22d3ee"
              strokeWidth={2}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </svg>
        <AnimatePresence>
          {nodes.map((node) => {
            const isEnd = node.isEndOfWord;
            const bg = isEnd ? 'bg-emerald-500' : 'bg-cyan-500';
            const border = isEnd ? 'border-emerald-300' : 'border-cyan-300';
            return (
              <motion.div
                key={node.id}
                className={`absolute w-10 h-10 flex items-center justify-center rounded-full border-2 text-white font-bold text-sm ${bg} ${border}`}
                initial={{ scale: 0, opacity: 0, x: node.x - 20, y: node.y - 20 }}
                animate={{ scale: 1, opacity: 1, x: node.x - 20, y: node.y - 20 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                {node.char || '*'}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
