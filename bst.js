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
}
