import { Node } from "./node"

export class RBNode<K, V> extends Node<K, V> {

    /** @internal */ _parent: RBNode<K, V> = RBNode.nilNode as RBNode<K, V>
    /** @internal */ _black = true

    /** @internal */ _left: RBNode<K, V> | null = null
    /** @internal */ _right: RBNode<K, V> | null = null

    /** @internal */ get _red() { return !this._black }
    /** @internal */ set _red(value: boolean) { this._black = !value }

    static readonly nilNode: RBNode<unknown, unknown> = _nilNode()

    /** True if node is nil */
    get nil(): boolean { return this === RBNode.nilNode }

    /** True if node is not nil */
    get ok(): boolean { return this !== RBNode.nilNode }


    _details(maxLength = 20) {
        const cut = (s: V | K | string) => ('' + s).slice(0, maxLength)
        const o = this._black ? '(' : '<'
        const c = this._black ? ')' : '>'
        const key = cut(this.key)
        const value = cut(this.value)
        const left = this._left.nil ? '·' : this._left.key
        const right = this._right.nil ? '·' : this._right.key
        return `${o}${cut(left)} ${key}:${value} ${cut(right)}${c}`
    }
}


// Nust be called only once because we should have only one nil Node!
function _nilNode(): RBNode<unknown, unknown> {
    const nil = new class extends RBNode<unknown, unknown> {
        public readonly _left = null
        public readonly _right = null
        public readonly _parent = null
        public readonly _black = true


        toString() { return '·' }
        _details() { return '(·)' }

        constructor() {
            super(Symbol('nilNode.key'), Symbol('nilNode.value'))
            this._parent = this._left = this._right = this
        }
    };

    const frozen = Object.freeze(
        nil
    );

    return frozen
}