// src/algorithms/trees/segmentTree.js
// Segment Tree implementation for range sum queries and updates.

class SegmentNode {
  constructor(start, end) {
    this.start = start;
    this.end = end;
    this.sum = 0;
    this.left = null;
    this.right = null;
    this.id = Date.now() + Math.random(); // unique id for visualization
  }
}

// Build segment tree from an array.
export const buildSegmentTree = (arr, start = 0, end = arr.length - 1) => {
  if (start > end) return null;
  const node = new SegmentNode(start, end);
  if (start === end) {
    node.sum = arr[start];
    return node;
  }
  const mid = Math.floor((start + end) / 2);
  node.left = buildSegmentTree(arr, start, mid);
  node.right = buildSegmentTree(arr, mid + 1, end);
  node.sum = (node.left?.sum || 0) + (node.right?.sum || 0);
  return node;
};

// Query range sum [l, r].
export const queryRange = (node, l, r) => {
  if (!node || l > node.end || r < node.start) return 0;
  if (l <= node.start && node.end <= r) return node.sum;
  return queryRange(node.left, l, r) + queryRange(node.right, l, r);
};

// Update index i to new value val.
export const updatePoint = (node, i, val) => {
  if (!node || i < node.start || i > node.end) return node;
  if (node.start === node.end && node.start === i) {
    node.sum = val;
    return node;
  }
  updatePoint(node.left, i, val);
  updatePoint(node.right, i, val);
  node.sum = (node.left?.sum || 0) + (node.right?.sum || 0);
  return node;
};

export default SegmentNode;
