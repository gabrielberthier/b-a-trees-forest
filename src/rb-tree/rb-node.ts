import { Node } from './node';

export enum Colors {
  RED = 0,
  BLACK = 1
}

export type URBNode<K, V> = RBNode<K | symbol, V | symbol>;

export class RBNode<K, V> extends Node<K, V> {
  protected _parent: URBNode<K, V>;

  protected _left: URBNode<K, V>;

  protected _right: URBNode<K, V>;

  color: Colors;

  constructor(key: K, value: V) {
    super(key, value);
    this.color = Colors.BLACK;
  }

  get left(): URBNode<K, V> {
    return this._left;
  }

  set left(node: URBNode<K, V>) {
    this._left = node;
  }

  get right(): URBNode<K, V> {
    return this._right;
  }

  set right(node: URBNode<K, V>) {
    this._right = node;
  }

  get parent(): URBNode<K, V> {
    return this._parent;
  }

  set parent(parent: URBNode<K, V>) {
    this._parent = parent;
  }

  flipColor() {
    this.color = 1 ^ this.color;
  }

  makeRed() {
    this.color = Colors.RED;
  }

  makeBlack() {
    this.color = Colors.BLACK;
  }

  isRed(): boolean {
    return this.color === Colors.RED;
  }

  isBlack(): boolean {
    return this.color === Colors.BLACK;
  }

  isLeftSon() {
    return this === this._parent._left;
  }

  isRightSon() {
    return this === this._parent._right;
  }

  isNil(): boolean {
    return false;
  }

  replaceChild(oldChild: RBNode<K, V>, newChild: RBNode<K, V>): void {
    if (oldChild.isLeftSon()) {
      this._left = newChild;
    } else if (oldChild.isRightSon()) {
      this._right = newChild;
    } else {
      console.log(oldChild);
    }
  }
}
