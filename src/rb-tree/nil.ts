import { Colors, RBNode } from './rb-node';

export class SingletonNilNode extends RBNode<symbol, symbol> {
  private static instance: SingletonNilNode;

  static readonly keyName = 'nilNode.key';

  private constructor() {
    super(Symbol(SingletonNilNode.keyName), Symbol(SingletonNilNode.keyName));
    this._parent = this._left = this._right = this;
    this.color = Colors.BLACK;
  }

  toString(): string {
    return '·';
  }

  _details() {
    return '(·)';
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): SingletonNilNode {
    if (!SingletonNilNode.instance) {
      SingletonNilNode.instance = new SingletonNilNode();
    }

    return SingletonNilNode.instance;
  }
}
