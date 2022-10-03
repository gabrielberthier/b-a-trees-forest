import { IComparator } from './comparator';
import { RBNode, URBNode } from './rb-node';
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
