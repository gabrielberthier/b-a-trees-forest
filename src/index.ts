import { RedBlackTree } from './rb-tree';
import { NumAscendingComparator } from './rb-tree/default-comparator';

const tree = new RedBlackTree<number, number>(new NumAscendingComparator());

const arr = Array.from({ length: 500 }, () => Math.floor(Math.random() * 1500));

const testKey = 500;

for (const iterator of arr) {
  tree.insert(iterator, iterator);
}

tree.transversePreorder();
const node = tree.searchNode(testKey);

console.log('Search for ', testKey);

console.log(node.describeSelf());

if (tree.red_black_tree_check()) {
  console.log('Tree is balanced');
}

// Let's test removal
if (node.isNil()) {
  tree.insert(testKey, testKey);
}

const nodeRemoved = tree.removeByKey(testKey);

console.log(nodeRemoved.describeSelf());

console.log('Node removed? ');

console.log(tree.searchNode(testKey).isNil());

if (tree.red_black_tree_check()) {
  console.log('Tree is still balanced :D');
}
