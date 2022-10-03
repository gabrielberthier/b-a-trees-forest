import { IComparator } from './comparator';
import { URBNode } from './rb-node';

export class NumAscendingComparator implements IComparator<number, number> {
  compare(
    value1: URBNode<number, number>,
    value2: URBNode<number, number>
  ): number {
    const k1 = value1.key as number;
    const k2 = value2.key as number;

    if (k1 > k2) {
      return 1;
    } else if (k1 < k2) {
      return -1;
    }
    return 0;
  }
}
