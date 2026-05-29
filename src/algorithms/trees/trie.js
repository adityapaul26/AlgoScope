// src/algorithms/trees/trie.js
// Simple Trie (prefix tree) implementation for insertion, search, and delete operations.

class TrieNode {
  constructor(char = '') {
    this.char = char; // character stored at this node
    this.children = {};
    this.isEndOfWord = false;
    this.id = Date.now() + Math.random(); // unique id for visualization
  }
}

export class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  // Insert a word into the trie.
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) {
        node.children[ch] = new TrieNode(ch);
      }
      node = node.children[ch];
    }
    node.isEndOfWord = true;
  }

  // Search for a complete word.
  search(word) {
    let node = this._traverse(word);
    return node ? node.isEndOfWord : false;
  }

  // Check if any word starts with the given prefix.
  startsWith(prefix) {
    return !!this._traverse(prefix);
  }

  // Helper to traverse the trie according to a string.
  _traverse(str) {
    let node = this.root;
    for (const ch of str) {
      if (!node.children[ch]) return null;
      node = node.children[ch];
    }
    return node;
  }

  // Delete a word from the trie. Returns true if deletion succeeded.
  delete(word) {
    const deleteRec = (node, depth) => {
      if (!node) return false;
      if (depth === word.length) {
        if (!node.isEndOfWord) return false; // word not present
        node.isEndOfWord = false;
        // If leaf node, indicate it can be removed.
        return Object.keys(node.children).length === 0;
      }
      const ch = word[depth];
      if (!node.children[ch]) return false;
      const shouldDeleteChild = deleteRec(node.children[ch], depth + 1);
      if (shouldDeleteChild) {
        delete node.children[ch];
        return !node.isEndOfWord && Object.keys(node.children).length === 0;
      }
      return false;
    };
    return deleteRec(this.root, 0);
  }
}

export default Trie;
