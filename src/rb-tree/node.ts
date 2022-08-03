export class Node<K, V> {
    /** @internal */ readonly _key: K
    /** @internal */ _value: V
    /** @internal */ _left: Node<K, V> | null = null
    /** @internal */ _right: Node<K, V> | null = null

    constructor(key: K, value: V) {
        this._key = key
        this._value = value
    }

    get key(): K { return this._key }

    get value(): V { return this._value }
    set value(value: V) { this._value = value }


    /** The entry which the Node represents */
    entry(): [K, V] { return [this.key, this.value] }

    /** Compact display of the node */
    toString(maxLength = 20): string {
        const key = ('' + this.key).slice(0, maxLength)
        const value = ('' + this.value).slice(0, maxLength)
        return `[${key}:${value}]`
    }
}



