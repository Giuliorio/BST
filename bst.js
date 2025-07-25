/**
 * Represents a node in a binary search tree.
 * Each node contains data and pointers to left and right child nodes.
 */
class Node {
  /**
   * @param {number} data - The value to store in the node.
   */
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

/**
 * Represents a balanced binary search tree.
 */
class Tree {
  /**
   * Creates a balanced binary search tree from an array of numbers.
   * @param {number[]} array - The input array to build the tree from.
   */
  constructor(array) {
    this.root = this.#buildTree(array);
  }

  /**
   * Prepares the array by removing duplicates and sorting,
   * then builds the balanced BST recursively.
   * @param {number[]} array - The array of numbers.
   * @returns {Node|null} The root node of the balanced BST.
   */
  #buildTree(array) {
    const uniqueSorted = [...new Set(array)].sort((a, b) => a - b);

    return this.#buildTreeRecursive(uniqueSorted, 0, uniqueSorted.length - 1);
  }

  /**
   * Recursively builds a balanced BST from the sorted array slice.
   * @param {number[]} array - Sorted array without duplicates.
   * @param {number} start - Starting index of the slice.
   * @param {number} end - Ending index of the slice.
   * @returns {Node|null} The root node of the subtree.
   */
  #buildTreeRecursive(array, start, end) {
    if (start > end) return null;

    let mid = start + Math.floor((end - start) / 2);

    let root = new Node(array[mid]);
    root.left = this.#buildTreeRecursive(array, start, mid - 1);
    root.right = this.#buildTreeRecursive(array, mid + 1, end);

    return root;
  }

  /**
   * Inserts a new value into the binary search tree.
   * Duplicates are ignored (no insertion occurs if value already exists).
   *
   * @param {number} data - The value to insert into the tree.
   * @returns {Node} The updated node after insertion.
   */
  insert(data) {
    return this.#insertRecursive(this.root, data);
  }

  /**
   * Recursively inserts a new value into the binary search tree starting from a given node.
   *
   * @private
   * @param {Node|null} root - The current node being examined during recursion.
   * @param {number} data - The value to insert.
   * @returns {Node} The updated node after insertion.
   */
  #insertRecursive(root, data) {
    if (root === null) return new Node(data);

    if (root.data === data) return root;

    if (data < root.data) {
      root.left = this.#insertRecursive(root.left, data);
    } else if (data > root.data) {
      root.right = this.#insertRecursive(root.right, data);
    }

    return root;
  }

  /**
   * Deletes a node with the given data from the tree.
   * @param {number} data - The value to delete.
   * @returns {Node|null} The new root after deletion.
   */
  delete(data) {
    return this.#deleteRecursive(this.root, data);
  }

  /**
   * Recursively deletes a node with the specified data starting from the given root.
   * @private
   * @param {Node|null} root - The current root node.
   * @param {number} data - The value to delete.
   * @returns {Node|null} The updated root node after deletion.
   */
  #deleteRecursive(root, data) {
    if (root === null) return null;

    if (root.data > data) {
      root.left = this.#deleteRecursive(root.left, data);
    } else if (root.data < data) {
      root.right = this.#deleteRecursive(root.right, data);
    } else {
      if (root.left === null) return root.right;
      if (root.right === null) return root.left;

      let successor = this.#getSuccessor(root);
      root.data = successor.data;
      root.right = this.#deleteRecursive(root.right, successor.data);
    }
    return root;
  }

  /**
   * Finds the in-order successor of the given node (the smallest node in the right subtree).
   * @private
   * @param {Node} current - The node to find the successor for.
   * @returns {Node} The successor node.
   */
  #getSuccessor(current) {
    current = current.right;
    while (current !== null && current.left !== null) {
      current = current.left;
    }
    return current;
  }

  /**
   * Searches for a node with the given data value.
   *
   * @param {number} value - The value to search for in the tree.
   * @returns {TreeNode|null} - The node containing the node if found, or null if not found.
   */
  findValue(value) {
    return this.#findValueRecursive(this.root, value);
  }

  /**
   * Recursively searches for a node with the given data starting from the provided root.
   *
   * @private
   * @param {TreeNode|null} root - The current node being examined.
   * @param {number} value - The value to search for.
   * @returns {TreeNode|null} - The node if found, otherwise null.
   */
  #findValueRecursive(root, value) {
    if (root === null) return null;

    if (root.data === value) return root;

    if (value < root.data) {
      return this.#findValueRecursive(root.left, value);
    } else {
      return this.#findValueRecursive(root.right, value);
    }
  }

  /**
   * Applies the provided callback to each node in the tree using level-order traversal (breadth-first).
   *
   * Traverses the tree starting from the root, visiting each level from left to right.
   * If the tree is empty, the function returns without invoking the callback.
   *
   * @param {function(Object): void} callback - A function to execute on each node.
   *        Receives the current node as its only argument.
   * @throws {Error} If the callback is not a function.
   */
  levelOrderForEach(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    if (!this.root) return;

    const queue = [this.root];
    this.#levelOrderForEachRecursive(queue, callback);
  }

  /**
   * Recursively processes each node in the queue using level-order traversal.
   *
   * Removes the front node from the queue, applies the callback,
   * then adds its children (if any) to the end of the queue.
   * Recurses until the queue is empty.
   *
   * @param {Object[]} queue - An array acting as a queue of nodes to process.
   * @param {function(Object): void} callback - The function to execute on each node.
   *        Assumes it is already validated to be a function.
   */
  #levelOrderForEachRecursive(queue, callback) {
    if (queue.length === 0) return;

    const node = queue.shift();
    try {
      callback(node);
    } catch (err) {
      console.error('Callback failed at node:', node, err);
    }

    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);

    this.#levelOrderForEachRecursive(queue, callback);
  }

  /**
   * Traverses the tree in in-order and calls the callback on each node.
   * @param {function} callback - Function to execute on each node. Receives the node as an argument.
   * @throws {Error} Throws if callback is not a function.
   */
  inOrderForEach(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    this.#inOrderForEachRecursive(this.root, callback);
  }

  /**
   * Recursively processes each node in the queue using in-order traversal.
   * @param {Node|null} root - Current node in the traversal.
   * @param {function} callback - Function to execute on each node.
   * @private
   */
  #inOrderForEachRecursive(root, callback) {
    if (root === null) return;

    if (root.left) this.#inOrderForEachRecursive(root.left, callback);

    try {
      callback(root);
    } catch (err) {
      console.error('Callback failed at node:', root, err);
    }

    if (root.right) this.#inOrderForEachRecursive(root.right, callback);

    return;
  }

  /**
   * Traverses the tree in pre-order and calls the callback on each node.
   * @param {function} callback - Function to execute on each node. Receives the node as an argument.
   * @throws {Error} Throws if callback is not a function.
   */
  preOrderForEach(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    this.#preOrderForEachRecursive(this.root, callback);
  }

  /**
   * Recursively processes each node in the queue using pre-order traversal.
   * @param {Node|null} root - Current node in the traversal.
   * @param {function} callback - Function to execute on each node.
   * @private
   */
  #preOrderForEachRecursive(root, callback) {
    if (root === null) return;

    try {
      callback(root);
    } catch (err) {
      console.error('Callback failed at node:', root, err);
    }

    if (root.left) this.#preOrderForEachRecursive(root.left, callback);

    if (root.right) this.#preOrderForEachRecursive(root.right, callback);

    return;
  }

  /**
   * Traverses the tree in post-order and calls the callback on each node.
   * @param {function} callback - Function to execute on each node. Receives the node as an argument.
   * @throws {Error} Throws if callback is not a function.
   */
  postOrderForEach(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    this.#postOrderForEachRecursive(this.root, callback);
  }

  /**
   * Recursively processes each node in the queue using post-order traversal.
   * @param {Node|null} root - Current node in the traversal.
   * @param {function} callback - Function to execute on each node.
   * @private
   */
  #postOrderForEachRecursive(root, callback) {
    if (root === null) return;

    if (root.left) this.#postOrderForEachRecursive(root.left, callback);

    if (root.right) this.#postOrderForEachRecursive(root.right, callback);

    try {
      callback(root);
    } catch (err) {
      console.error('Callback failed at node:', root, err);
    }

    return;
  }

  /**
   * Prints the entire binary tree starting from the root in a structured, readable format.
   */
  prettyPrint() {
    this.#prettyPrintRecursive(this.root);
  }

  /**
   * Recursively prints the binary tree in a visually structured format to the console.
   * Displays the right subtree above the root and the left subtree below,
   * using Unicode characters to show branches and hierarchy.
   *
   * @param {Node|null} node - The current node to print.
   * @param {string} [prefix=''] - The prefix string used for indentation and branch lines.
   * @param {boolean} [isLeft=true] - Indicates whether the current node is a left child.
   */
  #prettyPrintRecursive(node, prefix = '', isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.#prettyPrintRecursive(
        node.right,
        `${prefix}${isLeft ? '│   ' : '    '}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.left !== null) {
      this.#prettyPrintRecursive(
        node.left,
        `${prefix}${isLeft ? '    ' : '│   '}`,
        true
      );
    }
  }

  /**
   * Returns the height of the node containing the given value.
   * Height is defined as the number of edges in the longest path
   * from the node to a leaf node.
   *
   * @param {*} value - The value to find in the tree.
   * @returns {number|null} The height of the node if found, or null if not found.
   */
  height(value) {
    const node = this.findValue(value);
    if (!node) return null;

    return this.#getHeightRecursive(node);
  }

  /**
   * Recursively calculates the height of a given node.
   *
   * @private
   * @param {Object} root - The starting node.
   * @returns {number} The height from this node to its deepest leaf.
   */
  #getHeightRecursive(root) {
    if (!root.left && !root.right) return 0;
    const leftHeight = root.left ? this.#getHeightRecursive(root.left) : 0;
    const rightHeight = root.right ? this.#getHeightRecursive(root.right) : 0;
    return 1 + Math.max(leftHeight, rightHeight);
  }
}
