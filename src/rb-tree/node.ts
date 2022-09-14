type URNode<K, V> = Node<K | symbol, V | symbol>;

export class Node<K, V> {
  readonly _key: K;
  protected _value: V;
  protected _left?: URNode<K, V> = null;
  protected _right?: URNode<K, V> = null;

  constructor(key: K, value: V) {
    this._key = key;
    this._value = value;
  }

  get key(): K {
    return this._key;
  }

  get left(): URNode<K, V> {
    return this._left;
  }

  set left(node: URNode<K, V>) {
    this._left = node;
  }

  get right(): URNode<K, V> {
    return this._right;
  }

  set right(node: URNode<K, V>) {
    this._right = node;
  }

  get value(): V {
    return this._value;
  }

  set value(value: V) {
    this._value = value;
  }

  /** The entry which the Node represents */
  entry(): [K, V] {
    return [this.key, this.value];
  }

  /** Compact display of the node */
  toString(maxLength = 20): string {
    const key = ('' + this.key).slice(0, maxLength);
    const value = ('' + this.value).slice(0, maxLength);
    return `[${key}:${value}]`;
  }
}
