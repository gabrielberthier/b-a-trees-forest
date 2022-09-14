import { RBNode, RedBlackTree, TreePrinter } from './rb-tree';

const tree = new RedBlackTree<number, number>();

const arr = Array.from({ length: 200 }, () => Math.floor(Math.random() * 1500));

for (const iterator of new Set(arr)) {
  tree.insertion(new RBNode<number, number>(iterator, iterator));
}

const treePrinter = new TreePrinter(RedBlackTree.nilNode);

console.log('ROOT:\n', treePrinter.traversePreOrder(tree.getRoot()));
