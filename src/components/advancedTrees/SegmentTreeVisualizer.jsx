// src/components/advancedTrees/SegmentTreeVisualizer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { buildSegmentTree, updatePoint, queryRange } from '../../algorithms/trees/segmentTree';
import cloneDeep from 'lodash/cloneDeep';

// Layout helper (binary tree style)
const calculatePositions = (node, x, y, xOffset = 200) => {
  if (!node) return;
  node.x = x;
  node.y = y;
  const next = Math.max(xOffset / 1.8, 30);
  calculatePositions(node.left, x - xOffset, y + 80, next);
  calculatePositions(node.right, x + xOffset, y + 80, next);
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
    traverse(node.left, node);
    traverse(node.right, node);
  };
  traverse(root, null);
  return { nodes, edges };
};

export default function SegmentTreeVisualizer() {
  const [arrayInput, setArrayInput] = useState('');
  const [root, setRoot] = useState(null);
  const [queryStart, setQueryStart] = useState('');
  const [queryEnd, setQueryEnd] = useState('');
  const [updateIdx, setUpdateIdx] = useState('');
  const [updateVal, setUpdateVal] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const upd = () => {
      if (containerRef.current) {
        setDimensions({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight });
      }
    };
    upd();
    window.addEventListener('resize', upd);
    return () => window.removeEventListener('resize', upd);
  }, []);

  const handleBuild = () => {
    const nums = arrayInput.split(',').map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));
    if (nums.length === 0) return;
    const tree = buildSegmentTree(nums);
    setRoot(tree);
    setQueryResult(null);
  };

  const handleUpdate = () => {
    if (!root) return;
    const idx = parseInt(updateIdx);
    const val = parseInt(updateVal);
    if (isNaN(idx) || isNaN(val)) return;
    const newRoot = cloneDeep(root);
    updatePoint(newRoot, idx, val);
    setRoot(newRoot);
    setQueryResult(null);
  };

  const handleQuery = () => {
    if (!root) return;
    const l = parseInt(queryStart);
    const r = parseInt(queryEnd);
    if (isNaN(l) || isNaN(r)) return;
    const res = queryRange(root, l, r);
    setQueryResult(res);
  };

  const { nodes, edges } = React.useMemo(() => {
    if (!root) return { nodes: [], edges: [] };
    const centerX = dimensions.width / 2;
    calculatePositions(root, centerX, 50, Math.min(centerX / 2, 150));
    return getNodesAndEdges(root);
  }, [root, dimensions.width]);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 p-4 bg-slate-900/50 rounded-xl border border-white/5 mb-4">
        <input
          placeholder="Array (e.g. 1,2,3,4)"
          value={arrayInput}
          onChange={(e) => setArrayInput(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:border-cyan-500 outline-none"
        />
        <button type="button" onClick={() => { console.log('Segment Build clicked'); handleBuild(); }} className="px-3 py-1 bg-cyan-600 text-white rounded hover:bg-cyan-500">Build</button>
        <input
          placeholder="Idx"
          value={updateIdx}
          onChange={(e) => setUpdateIdx(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white w-12 focus:border-cyan-500 outline-none"
        />
        <input
          placeholder="Val"
          value={updateVal}
          onChange={(e) => setUpdateVal(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white w-12 focus:border-cyan-500 outline-none"
        />
        <button type="button" onClick={() => { console.log('Segment Update clicked'); handleUpdate(); }} className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-500">Update</button>
        <input
          placeholder="L"
          value={queryStart}
          onChange={(e) => setQueryStart(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white w-12 focus:border-cyan-500 outline-none"
        />
        <input
          placeholder="R"
          value={queryEnd}
          onChange={(e) => setQueryEnd(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white w-12 focus:border-cyan-500 outline-none"
        />
        <button type="button" onClick={() => { console.log('Segment Query clicked'); handleQuery(); }} className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-500">Query</button>
        {queryResult !== null && (
          <span className="ml-4 text-cyan-300 font-mono">Result: {queryResult}</span>
        )}
      </div>

      {/* Visualisation */}
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
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              className="absolute w-12 h-8 flex items-center justify-center rounded bg-cyan-500 text-white font-mono text-sm border border-cyan-300"
              initial={{ scale: 0, opacity: 0, x: node.x - 24, y: node.y - 16 }}
              animate={{ scale: 1, opacity: 1, x: node.x - 24, y: node.y - 16 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {node.sum}
            </motion.div>
          ))}
        </AnimatePresence>
        {!root && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            Build a segment tree from an array.
          </div>
        )}
      </div>
    </div>
  );
}
