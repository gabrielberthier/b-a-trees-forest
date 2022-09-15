import { Colors, RBNode, URBNode } from './rb-node';
import { TreePrinter } from './tree-printer';

const _nilFactory = (nilKey: string): RBNode<symbol, symbol> => {
  const nilNode = new (class extends RBNode<symbol, symbol> {
    constructor() {
      super(Symbol(nilKey), Symbol(nilKey));
      this._parent = this._left = this._right = this;
    }

    isNil(): boolean {
      return true;
    }

    toString(): string {
      return '·';
    }

    _details() {
      return '(·)';
    }
  })();

  return Object.seal(nilNode);
};

export class RedBlackTree<K, V = unknown> {
  protected root: URBNode<K, V>;
  private treePrinter: TreePrinter<K, V>;

  readonly nilNode = _nilFactory('nilNode.key');

  constructor() {
    this.root = this.nilNode;
    this.treePrinter = new TreePrinter(this.nilNode);
  }

  searchNode(key: K): URBNode<K, V> {
    let tmp: URBNode<K, V> = this.root;
    while (!tmp.isNil()) {
      if (key == tmp.key) {
        return tmp;
      } else if (key < (tmp.key as K)) {
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

  private rightRotate(node: URBNode<K, V>): URBNode<K, V> {
    const y = node.left;
    node.left = y.right;

    if (!y.right.isNil()) {
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
    if (!y.left.isNil()) {
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
    if (!newChild.isNil()) {
      newChild.parent = parent;
    }

    if (parent.isNil()) {
      this.root = newChild;
    } else {
      parent.replaceChild(node, newChild);
    }
  }

  insertion(node: RBNode<K, V>): void {
    let y: URBNode<K, V> = this.nilNode;
    let x = this.root;
    while (!x.isNil()) {
      const key: K = x.key as K;
      y = x;
      x = node.key < key ? x.left : x.right;
    }
    node.left = this.nilNode;
    node.right = this.nilNode;
    node.parent = this.nilNode;

    if (y.isNil()) {
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
    if (!node.isNil()) {
      this.inOrderHelper(node.left);
      console.log(node.value.toString() + ' ');
      this.inOrderHelper(node.right);
    }
  }

  transversePreorder() {
    console.log('ROOT:\n', this.treePrinter.traversePreOrder(this.root));
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
