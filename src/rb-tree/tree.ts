import { IComparator } from './comparator';
import { _nilFactory } from './nil-factory';
import { Colors, RBNode, URBNode } from './rb-node';
import { TreePrinter } from './tree-printer';

export class RedBlackTree<K, V = unknown> {
  protected root: URBNode<K, V>;
  private treePrinter: TreePrinter<K, V>;

  readonly nilNode = _nilFactory('nilNode.key');

  constructor(private comparator: IComparator<K, V>) {
    this.root = this.nilNode;
    this.treePrinter = new TreePrinter(this.nilNode);
  }

  searchNode(key: K): URBNode<K, V> {
    let tmp: URBNode<K, V> = this.root;
    const node = new RBNode<K, V>(key, undefined);
    while (!tmp.isNil()) {
      const idx = this.comparator.compare(node, tmp);
      if (idx === 0) {
        return tmp;
      } else if (idx < 0) {
        tmp = tmp.left;
      } else {
        tmp = tmp.right;
      }
    }

    return this.nilNode;
  }

  public getRoot(): URBNode<K, V> {
    return this.root;
  }

  rotate(node: URBNode<K, V>, moveTo: string) {
    const side = moveTo === 'left' ? 'right' : 'left';
    const swip = moveTo;
    const y = node[side];
    node[side] = y[swip];
    if (!y[swip].isNil()) {
      y[swip].parent = node;
    }

    this.replaceParentsChild(node, y);
    y[swip] = node;
    node.parent = y;

    return y;
  }

  private rightRotate(node: URBNode<K, V>): URBNode<K, V> {
    return this.rotate(node, 'right');
  }

  private leftRotate(node: URBNode<K, V>): URBNode<K, V> {
    return this.rotate(node, 'left');
  }

  private replaceParentsChild(
    node: URBNode<K, V>,
    newChild: URBNode<K, V>
  ): void {
    const parent = node.parent;
    if (!newChild.isNil()) {
      newChild.parent = parent;
    }

    if (parent.isNil()) {
      this.root = newChild;
    } else {
      parent.replaceChild(node, newChild);
    }
  }

  public insert(key: K, value: V): void {
    const node = new RBNode<K, V>(key, value);
    node.right = node.parent = node.left = this.nilNode;

    this.insertion(node);
  }

  private insertion(node: RBNode<K, V>): void {
    let y: URBNode<K, V> = this.nilNode;
    let x = this.root;
    while (!x.isNil()) {
      y = x;
      const comparing = this.comparator.compare(node, x);

      if (comparing < 0) {
        x = x.left;
      } else if (comparing > 0) {
        x = x.right;
      } else {
        return;
      }
    }

    if (y.isNil()) {
      this.root = node;
    } else if (this.comparator.compare(node, y) < 0) {
      y.left = node;
    } else {
      y.right = node;
    }

    node.parent = y;

    node.makeRed();

    this.insertionFixup(node);
  }

  insertionFixup(node: URBNode<K, V>): void {
    while (node.parent.isRed()) {
      if (node.parent.isLeftSon()) {
        const y = node.parent.parent.right;
        if (y.isRed()) {
          node.parent.makeBlack();
          y.makeBlack();
          node.parent.parent.makeRed();
          node = node.parent.parent;
        } else {
          if (node.isRightSon()) {
            node = node.parent;
            this.leftRotate(node);
          }

          node.parent.makeBlack();
          node.parent.parent.makeRed();

          this.rightRotate(node.parent.parent);
        }
      } else {
        const y = node.parent.parent.left;
        if (y.isRed()) {
          node.parent.makeBlack();
          y.makeBlack();
          node.parent.parent.makeRed();
          node = node.parent.parent;
        } else {
          if (node.isLeftSon()) {
            node = node.parent;
            this.rightRotate(node);
          }

          node.parent.makeBlack();
          node.parent.parent.makeRed();

          this.leftRotate(node.parent.parent);
        }
      }
    }

    this.root.makeBlack();
  }

  removeByKey(key: K) {
    const node = this.searchNode(key);
    if (!node.isNil()) {
      this.delete(node);
    }

    return node;
  }

  delete(deleteNode: URBNode<K, V>): URBNode<K, V> {
    let replaceNode: URBNode<K, V> = this.nilNode; // track node that replaces removedOrMovedNode
    if (!(deleteNode.isNil() || deleteNode.isNil())) {
      let removedOrMovedNode = deleteNode; // same as deleteNode if it has only one child, and otherwise it replaces deleteNode

      if (deleteNode.left.isNil()) {
        replaceNode = deleteNode.right;
        this.rbTreeTransplant(deleteNode, deleteNode.right);
      } else if (deleteNode.right.isNil()) {
        replaceNode = deleteNode.left;
        this.rbTreeTransplant(deleteNode, deleteNode.left);
      } else {
        removedOrMovedNode = this.getMinimum(deleteNode.right);
        replaceNode = removedOrMovedNode.right;
        if (removedOrMovedNode.parent === deleteNode) {
          replaceNode.parent = removedOrMovedNode;
        } else {
          this.rbTreeTransplant(removedOrMovedNode, removedOrMovedNode.right);
          removedOrMovedNode.right = deleteNode.right;
          removedOrMovedNode.right.parent = removedOrMovedNode;
        }

        this.rbTreeTransplant(deleteNode, removedOrMovedNode);
        removedOrMovedNode.left = deleteNode.left;
        removedOrMovedNode.left.parent = removedOrMovedNode;
        removedOrMovedNode.color = deleteNode.color;
      }

      if (removedOrMovedNode.isBlack()) {
        this.deleteRBFixup(replaceNode);
      }
    }

    return replaceNode;
  }

  /**
   * Restores Red-Black tree properties after delete if needed.
   */
  deleteRBFixup(x: URBNode<K, V>) {
    while (x !== this.root && x.isBlack()) {
      if (x === x.parent.left) {
        let w = x.parent.right;
        if (w.isRed()) {
          // case 1 - sibling is red
          w.makeBlack();
          x.parent.makeRed();
          this.leftRotate(x.parent);
          w = x.parent.right; // converted to case 2, 3 or 4
        }
        // case 2 sibling is black and both of its children are black
        if (w.left.isBlack() && w.right.isBlack()) {
          w.makeRed();
          x = x.parent;
        } else if (!w.isNil()) {
          if (w.right.isBlack()) {
            // case 3 sibling is black and its left child is red and right child is black
            w.left.makeBlack();
            w.makeRed();
            this.rightRotate(w);
            w = x.parent.right;
          }
          w.color = x.parent.color; // case 4 sibling is black and right child is red
          x.parent.makeBlack();
          w.right.makeBlack();
          this.leftRotate(x.parent);
          x = this.root;
        } else {
          x.makeBlack();
          x = x.parent;
        }
      } else {
        let w = x.parent.left;
        if (w.isRed()) {
          // case 1 - sibling is red
          w.makeBlack();
          x.parent.makeRed();
          this.rightRotate(x.parent);
          w = x.parent.left; // converted to case 2, 3 or 4
        }
        // case 2 sibling is black and both of its children are black
        if (w.left.isBlack() && w.right.isBlack()) {
          w.makeRed();
          x = x.parent;
        } else if (!w.isNil()) {
          if (w.left.isBlack) {
            // case 3 sibling is black and its right child is red and left child is black
            w.right.makeBlack();
            w.makeRed();
            this.leftRotate(w);
            w = x.parent.left;
          }
          w.color = x.parent.color; // case 4 sibling is black and left child is red
          x.parent.makeBlack();
          w.left.makeBlack();
          this.rightRotate(x.parent);
          x = this.root;
        } else {
          x.makeBlack();
          x = x.parent;
        }
      }
    }
  }

  /**
   * Similar to original transplant() method in BST but uses nilNode instead of null.
   */
  private rbTreeTransplant(
    nodeToReplace: URBNode<K, V>,
    newNode: URBNode<K, V>
  ) {
    if (nodeToReplace.parent.isNil()) {
      this.root = newNode;
    } else if (nodeToReplace == nodeToReplace.parent.left) {
      nodeToReplace.parent.left = newNode;
    } else {
      nodeToReplace.parent.right = newNode;
    }
    newNode.parent = nodeToReplace.parent;
    return newNode;
  }

  private getMinimum(node: URBNode<K, V>): URBNode<K, V> {
    while (!node.left.isNil()) {
      node = node.left;
    }
    return node;
  }

  private getMaximum(node: URBNode<K, V>): URBNode<K, V> {
    while (node.right.isNil()) {
      node = node.right;
    }
    return node;
  }

  // In-Order traversal
  // Left Subtree . Node . Right Subtree
  public inorder() {
    this.inOrderHelper(this.root);
  }

  private inOrderHelper(node: URBNode<K, V>) {
    if (!node.isNil()) {
      this.inOrderHelper(node.left);
      console.log(node.value.toString() + ' ');
      this.inOrderHelper(node.right);
    }
  }

  transversePreorder() {
    console.log('ROOT:\n', this.treePrinter.traversePreOrder(this.root));
  }

  red_black_tree_check() {
    return this.subtreeCheck(this.root).reverse().pop();
  }

  subtreeCheck(node: URBNode<K, V>): [boolean, number] {
    if (node.isNil()) return [true, 1];
    if (node.parent.isNil() && node.isRed()) return [false, 0];
    let countBlacks = 0;
    if (node.isRed()) {
      if (
        (!node.left.isNil() && node.left.isRed()) ||
        (!node.right.isNil() && node.right.isRed())
      ) {
        return [false, -1];
      }
    } else {
      countBlacks = 1;
    }

    const [left, countBlacksleft] = this.subtreeCheck(node.left);
    const [right, countBlacksRight] = this.subtreeCheck(node.right);

    return [
      Array.of(left, right, countBlacksleft === countBlacksRight).every(
        (el) => el
      ),
      countBlacks + countBlacksRight
    ];
  }

  _details(node: URBNode<K, V>, maxLength = 20) {
    const cut = (s: V | K | string | symbol) =>
      s.toString().slice(0, maxLength);
    const o = node.isBlack() ? '(' : '<';
    const c = node.isBlack() ? ')' : '>';
    const key = cut(node.key);
    const value = cut(node.value);
    const left = node.left.isNil() ? '·' : node.left.key;
    const right = node.right.isNil() ? '·' : node.right.key;
    return `${o}${cut(left)} ${key}:${value} ${cut(right)}${c}`;
  }
}
