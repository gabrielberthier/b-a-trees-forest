import { RedBlackTree } from './rb-tree';
import { NumAscendingComparator } from './rb-tree/default-comparator';

const tree = new RedBlackTree<number, number>(new NumAscendingComparator());

const arr = Array.from({ length: 500 }, () => Math.floor(Math.random() * 1500));

for (const iterator of [1, 2, 3, 4, 5, 6, 7, 8]) {
  tree.insert(iterator, iterator);
}

tree.transversePreorder();
const node = tree.searchNode(2);

console.log(node);

console.log(tree.red_black_tree_check());
