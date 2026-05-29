// src/algorithms/trees/avlTree.js
// AVL Tree implementation with insertion, deletion, rotations, and balance factor calculation.

class AVLNode {
  constructor(value) {
    this.value = value;
    this.height = 1; // height of node
    this.left = null;
    this.right = null;
    this.id = Date.now() + Math.random(); // unique id for visualization
  }
}

// Helper functions
const height = (node) => (node ? node.height : 0);
const getBalance = (node) => (node ? height(node.left) - height(node.right) : 0);

const rightRotate = (y) => {
  const x = y.left;
  const T2 = x.right;
  // Rotation
  x.right = y;
  y.left = T2;
  // Update heights
  y.height = Math.max(height(y.left), height(y.right)) + 1;
  x.height = Math.max(height(x.left), height(x.right)) + 1;
  return x;
};

const leftRotate = (x) => {
  const y = x.right;
  const T2 = y.left;
  // Rotation
  y.left = x;
  x.right = T2;
  // Update heights
  x.height = Math.max(height(x.left), height(x.right)) + 1;
  y.height = Math.max(height(y.left), height(y.right)) + 1;
  return y;
};

// Insert a value and return new root
export const avlInsert = (root, value) => {
  if (!root) return new AVLNode(value);
  if (value < root.value) {
    root.left = avlInsert(root.left, value);
  } else if (value > root.value) {
    root.right = avlInsert(root.right, value);
  } else {
    // duplicate values are ignored
    return root;
  }

  // Update height
  root.height = Math.max(height(root.left), height(root.right)) + 1;

  // Balance the node
  const balance = getBalance(root);

  // Left Left Case
  if (balance > 1 && value < root.left.value) {
    return rightRotate(root);
  }
  // Right Right Case
  if (balance < -1 && value > root.right.value) {
    return leftRotate(root);
  }
  // Left Right Case
  if (balance > 1 && value > root.left.value) {
    root.left = leftRotate(root.left);
    return rightRotate(root);
  }
  // Right Left Case
  if (balance < -1 && value < root.right.value) {
    root.right = rightRotate(root.right);
    return leftRotate(root);
  }

  return root;
};

// Find the node with minimum value (used in deletion)
const minValueNode = (node) => {
  let current = node;
  while (current.left) current = current.left;
  return current;
};

// Delete a value and return new root
export const avlDelete = (root, value) => {
  if (!root) return root;

  if (value < root.value) {
    root.left = avlDelete(root.left, value);
  } else if (value > root.value) {
    root.right = avlDelete(root.right, value);
  } else {
    // Node to be deleted found
    if (!root.left || !root.right) {
      const temp = root.left ? root.left : root.right;
      if (!temp) {
        // No child
        return null;
      } else {
        // One child
        return temp;
      }
    } else {
      // Two children: get inorder successor
      const temp = minValueNode(root.right);
      root.value = temp.value;
      root.right = avlDelete(root.right, temp.value);
    }
  }

  // Update height
  root.height = Math.max(height(root.left), height(root.right)) + 1;

  // Balance the node
  const balance = getBalance(root);

  // Left Left
  if (balance > 1 && getBalance(root.left) >= 0) {
    return rightRotate(root);
  }
  // Left Right
  if (balance > 1 && getBalance(root.left) < 0) {
    root.left = leftRotate(root.left);
    return rightRotate(root);
  }
  // Right Right
  if (balance < -1 && getBalance(root.right) <= 0) {
    return leftRotate(root);
  }
  // Right Left
  if (balance < -1 && getBalance(root.right) > 0) {
    root.right = rightRotate(root.right);
    return leftRotate(root);
  }

  return root;
};

// Utility to compute balance factor for a node (for UI coloring)
export const getBalanceFactor = (node) => (node ? getBalance(node) : 0);

export default AVLNode;
