import { URBNode } from './rb-node';

export interface IComparator<K, V> {
  compare(value1: URBNode<K, V>, value2: URBNode<K, V>): number;
}
