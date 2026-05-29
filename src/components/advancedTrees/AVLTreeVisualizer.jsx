// src/components/advancedTrees/AVLTreeVisualizer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { avlInsert, avlDelete, getBalanceFactor } from '../../algorithms/trees/avlTree';
import { cloneDeep } from 'lodash';

// Reuse tree layout utilities from TreeIV (position calculation)
const calculatePositions = (node, x, y, xOffset = 200) => {
  if (!node) return;
  node.x = x;
  node.y = y;
  const nextOffset = Math.max(xOffset / 1.8, 30);
  calculatePositions(node.left, x - xOffset, y + 80, nextOffset);
  calculatePositions(node.right, x + xOffset, y + 80, nextOffset);
};

const getTreeNodesAndEdges = (root) => {
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

export default function AVLTreeVisualizer() {
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setDimensions({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleInsert = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    const newRoot = avlInsert(root ? cloneDeep(root) : null, val);
    setRoot(newRoot);
    setInputValue('');
  };

  const handleDelete = () => {
    const val = parseInt(inputValue);
    if (isNaN(val) || !root) return;
    const newRoot = avlDelete(cloneDeep(root), val);
    setRoot(newRoot);
    setInputValue('');
  };

  const { nodes, edges } = React.useMemo(() => {
    if (!root) return { nodes: [], edges: [] };
    const centerX = dimensions.width / 2;
    calculatePositions(root, centerX, 50, Math.min(centerX / 2, 150));
    return getTreeNodesAndEdges(root);
  }, [root, dimensions.width]);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Controls */}
      <div className="flex gap-4 p-4 bg-slate-900/50 rounded-xl border border-white/5 mb-4">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Value"
          className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:border-cyan-500 outline-none"
        />
        <button type="button" onClick={() => { console.log('AVL Insert clicked'); handleInsert(); }} className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-500 transition">
          Insert
        </button>
        <button type="button" onClick={() => { console.log('AVL Delete clicked'); handleDelete(); }} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition">
          Delete
        </button>
      </div>

      {/* Visualisation */}
      <div ref={containerRef} className="relative flex-1 overflow-hidden bg-slate-900/30 backdrop-blur-sm rounded-xl border border-white/5">
        {/* Edges */}
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
            const balance = getBalanceFactor(node);
            const bgColor = balance > 0 ? 'bg-emerald-500' : balance < 0 ? 'bg-rose-500' : 'bg-cyan-500';
            const border = balance > 0 ? 'border-emerald-300' : balance < 0 ? 'border-rose-300' : 'border-cyan-300';
            return (
              <motion.div
                key={node.id}
                className={`absolute w-10 h-10 flex items-center justify-center rounded-full border-2 text-white font-bold text-sm ${bgColor} ${border}`}
                initial={{ scale: 0, opacity: 0, x: node.x - 20, y: node.y - 20 }}
                animate={{ scale: 1, opacity: 1, x: node.x - 20, y: node.y - 20 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                {node.value}
              </motion.div>
            );
          })}
        </AnimatePresence>
        {!root && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500">
            Insert values to build an AVL tree.
          </div>
        )}
      </div>
    </div>
  );
}
