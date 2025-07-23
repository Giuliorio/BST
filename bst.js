/**
 * Represents a node in a binary search tree.
 * Each node contains data and pointers to left and right child nodes.
 */
class Node {
  /**
   * @param {*} data - The value to store in the node.
   */
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}
