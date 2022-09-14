import { SingletonNilNode as Nil } from './nil';
import { Colors, RBNode, URBNode } from './rb-node';

export class RedBlackTree<K, V = unknown> {
  protected root: URBNode<K, V>;

  static readonly nilNode = Nil.getInstance();

  constructor() {
    this.root = RedBlackTree.nilNode;
  }

  isNil(node: URBNode<K, V>): boolean {
    return node === RedBlackTree.nilNode;
  }

  public getRoot(): URBNode<K, V> {
    return this.root;
  }

  private rightRotate(node: URBNode<K, V>): URBNode<K, V> {
    const y = node.left;

    node.left = y.right;

    if (!this.isNil(y.right)) {
      y.right.parent = node;
    }

    this.replaceParentsChild(node, y);
    y.right = node;
    node.parent = y;

    return y;
  }

  private leftRotate(node: URBNode<K, V>): URBNode<K, V> {
    const y = node.right;
    node.right = y.left;
    if (!this.isNil(y.left)) {
      y.left.parent = node;
    }

    this.replaceParentsChild(node, y);
    y.left = node;
    node.parent = y;

    return y;
  }

  private replaceParentsChild(
    node: URBNode<K, V>,
    newChild: URBNode<K, V>
  ): void {
    const parent = node.parent;

    if (this.isNil(parent)) {
      this.root = newChild;
    } else {
      parent.replaceChild(node, newChild);

      if (!this.isNil(newChild)) {
        newChild.parent = parent;
      }
    }
  }

  insertion(node: RBNode<K, V>): void {
    let y: URBNode<K, V> = RedBlackTree.nilNode;
    let x = this.root;
    while (!this.isNil(x)) {
      const key: K = x.key as K;
      y = x;
      x = node.key < key ? x.left : x.right;
    }
    node.left = RedBlackTree.nilNode;
    node.right = RedBlackTree.nilNode;
    node.parent = RedBlackTree.nilNode;

    if (this.isNil(y)) {
      this.root = node;
    } else if (node.key < (y.key as K)) {
      y.left = node;
    } else y.right = node;

    node.parent = y;

    node.color = Colors.RED;

    this.insertionFixup(node);
  }

  insertionFixup(node: URBNode<K, V>): void {
    while (node.parent.color === Colors.RED) {
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
        if (y.color === Colors.RED) {
          node.parent.color = Colors.BLACK;
          y.color = Colors.BLACK;
          node.parent.parent.color = Colors.RED;
          node = node.parent.parent;
        } else {
          if (node.isLeftSon()) {
            node = node.parent;
            this.rightRotate(node);
          }

          node.parent.color = Colors.BLACK;
          node.parent.parent.color = Colors.RED;

          this.leftRotate(node.parent.parent);
        }
      }
    }

    this.root.color = Colors.BLACK;
  }

  // In-Order traversal
  // Left Subtree . Node . Right Subtree
  public inorder() {
    this.inOrderHelper(this.root);
  }

  private inOrderHelper(node: URBNode<K, V>) {
    if (!this.isNil(node)) {
      this.inOrderHelper(node.left);
      console.log(node.value.toString() + ' ');
      this.inOrderHelper(node.right);
    }
  }

  _details(node: URBNode<K, V>, maxLength = 20) {
    const cut = (s: V | K | string | symbol) =>
      s.toString().slice(0, maxLength);
    const o = node.isBlack() ? '(' : '<';
    const c = node.isBlack() ? ')' : '>';
    const key = cut(node.key);
    const value = cut(node.value);
    const left = this.isNil(node.left) ? '·' : node.left.key;
    const right = this.isNil(node.right) ? '·' : node.right.key;
    return `${o}${cut(left)} ${key}:${value} ${cut(right)}${c}`;
  }
}
