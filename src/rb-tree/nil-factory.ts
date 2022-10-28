import { RBNode } from './rb-node';

export const _nilFactory = (nilKey: string): RBNode<symbol, symbol> => {
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
