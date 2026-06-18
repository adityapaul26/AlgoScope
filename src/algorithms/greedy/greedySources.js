export const greedySources = {
  huffman: {
    javascript: {
      code: `function buildHuffmanTree(text) {
  // Step 1: Calculate character frequencies
  const freq = {};
  for (let char of text) {
    freq[char] = (freq[char] || 0) + 1;
  }

  // Step 2: Initialize priority queue with leaf nodes
  const pq = Object.keys(freq).map(char => ({
    char,
    freq: freq[char],
    left: null,
    right: null
  }));

  // Step 3: Repeatedly merge two lowest frequency nodes
  while (pq.length > 1) {
    pq.sort((a, b) => a.freq - b.freq);
    const left = pq.shift();
    const right = pq.shift();
    
    const parent = {
      char: null,
      freq: left.freq + right.freq,
      left,
      right
    };
    pq.push(parent);
  }

  return pq[0]; // Root node
}`,
      lineMap: {
        init: 2,
        freq: 3,
        pq: 8,
        loop: 16,
        sort: 17,
        pick: 18,
        merge: 21,
        push: 27,
        finish: 30,
      },
    },
    python: {
      code: `import heapq

def build_huffman_tree(text):
    # Step 1: Calculate character frequencies
    freq = {}
    for char in text:
        freq[char] = freq.get(char, 0) + 1
        
    # Step 2: Create priority queue
    pq = [[f, [c, ""]] for c, f in freq.items()]
    heapq.heapify(pq)
    
    # Step 3: Repeatedly merge nodes
    while len(pq) > 1:
        left = heapq.heappop(pq)
        right = heapq.heappop(pq)
        
        for pair in left[1:]:
            pair[1] = '0' + pair[1]
        for pair in right[1:]:
            pair[1] = '1' + pair[1]
            
        merged = [left[0] + right[0]] + left[1:] + right[1:]
        heapq.heappush(pq, merged)
        
    return pq[0]`,
    },
    cpp: {
      code: `struct Node {
    char ch;
    int freq;
    Node *left, *right;
};

struct compare {
    bool operator()(Node* l, Node* r) {
        return l->freq > r->freq;
    }
};

Node* buildHuffmanTree(string text) {
    unordered_map<char, int> freq;
    for (char ch: text) freq[ch]++;
    
    priority_queue<Node*, vector<Node*>, compare> pq;
    for (auto pair: freq) {
        pq.push(new Node{pair.first, pair.second, nullptr, nullptr});
    }
    
    while (pq.size() > 1) {
        Node *left = pq.top(); pq.pop();
        Node *right = pq.top(); pq.pop();
        
        int sum = left->freq + right->freq;
        pq.push(new Node{'\\0', sum, left, right});
    }
    
    return pq.top();
}`,
    },
    java: {
      code: `class HuffmanNode {
    char data;
    int frequency;
    HuffmanNode left, right;
}

public static HuffmanNode buildTree(String text) {
    Map<Character, Integer> freq = new HashMap<>();
    for (char c : text.toCharArray()) {
        freq.put(c, freq.getOrDefault(c, 0) + 1);
    }
    
    PriorityQueue<HuffmanNode> pq = new PriorityQueue<>((a, b) -> a.frequency - b.frequency);
    for (var entry : freq.entrySet()) {
        HuffmanNode node = new HuffmanNode();
        node.data = entry.getKey();
        node.frequency = entry.getValue();
        pq.add(node);
    }
    
    while (pq.size() > 1) {
        HuffmanNode x = pq.poll();
        HuffmanNode y = pq.poll();
        
        HuffmanNode f = new HuffmanNode();
        f.frequency = x.frequency + y.frequency;
        f.data = '-';
        f.left = x;
        f.right = y;
        pq.add(f);
    }
    
    return pq.poll();
}`,
    },
  },
  knapsack: {
    javascript: {
      code: `function fractionalKnapsack(capacity, items) {
  // Step 1: Calculate ratios
  items.forEach(item => {
    item.ratio = item.value / item.weight;
  });

  // Step 2: Sort items by value/weight ratio descending
  items.sort((a, b) => b.ratio - a.ratio);

  let totalValue = 0;

  // Step 3: Greedily pack items
  for (let item of items) {
    if (capacity >= item.weight) {
      capacity -= item.weight;
      totalValue += item.value;
    } else {
      // Pack fraction of item
      totalValue += item.ratio * capacity;
      capacity = 0;
      break;
    }
  }

  return totalValue;
}`,
      lineMap: {
        init: 1,
        ratio: 3,
        sort: 8,
        total: 10,
        loop: 13,
        check: 14,
        packFull: 15,
        packFraction: 18,
        finish: 24,
      },
    },
    python: {
      code: `def fractional_knapsack(capacity, items):
    # Step 1: Calculate value/weight ratio
    for item in items:
        item['ratio'] = item['value'] / item['weight']
        
    # Step 2: Sort items by ratio descending
    items.sort(key=lambda x: x['ratio'], reverse=True)
    
    total_value = 0.0
    
    # Step 3: Pack items
    for item in items:
        if capacity >= item['weight']:
            capacity -= item['weight']
            total_value += item['value']
        else:
            # Take fraction
            fraction = capacity / item['weight']
            total_value += item['value'] * fraction
            break
            
    return total_value`,
    },
    cpp: {
      code: `struct Item {
    int value, weight;
};

bool cmp(struct Item a, struct Item b) {
    double r1 = (double)a.value / (double)a.weight;
    double r2 = (double)b.value / (double)b.weight;
    return r1 > r2;
}

double fractionalKnapsack(int W, struct Item arr[], int N) {
    sort(arr, arr + N, cmp);
    
    double totalValue = 0.0;
    
    for (int i = 0; i < N; i++) {
        if (W >= arr[i].weight) {
            W -= arr[i].weight;
            totalValue += arr[i].value;
        } else {
            totalValue += arr[i].value * ((double)W / (double)arr[i].weight);
            break;
        }
    }
    return totalValue;
}`,
    },
    java: {
      code: `class Item {
    int value, weight;
    Item(int val, int wt) { this.value = val; this.weight = wt; }
}

public static double getMaxValue(int W, Item[] arr) {
    Arrays.sort(arr, (a, b) -> {
        double r1 = (double) a.value / (double) a.weight;
        double r2 = (double) b.value / (double) b.weight;
        return Double.compare(r2, r1);
    });
    
    double totalValue = 0d;
    
    for (Item item : arr) {
        if (W >= item.weight) {
            W -= item.weight;
            totalValue += item.value;
        } else {
            double fraction = ((double) W / item.weight);
            totalValue += fraction * item.value;
            break;
        }
    }
    
    return totalValue;
}`,
    },
  },
}

export const getGreedySource = (algo, lang) => {
  return greedySources[algo]?.[lang]?.code || ''
}

export const resolveGreedyLine = (algo, language, lineKey) => {
  if (!lineKey) return undefined
  const source =
    greedySources[algo]?.[language] || greedySources[algo]?.javascript
  return source?.lineMap?.[lineKey]
}
