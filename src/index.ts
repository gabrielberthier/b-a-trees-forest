import { RBNode, RedBlackTree } from './rb-tree';

const tree = new RedBlackTree<number, number>();

const arr = Array.from({ length: 500 }, () => Math.floor(Math.random() * 1500));

for (const iterator of [1, 2, 3, 4, 5, 6, 7, 8]) {
  tree.insertion(new RBNode<number, number>(iterator, iterator));
}

tree.transversePreorder();
const node = tree.searchNode(2);

console.log(node);

console.log(tree.red_black_tree_check());
