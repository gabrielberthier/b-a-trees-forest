import { RBNode, RedBlackTree } from './rb-tree';

const tree = new RedBlackTree<number, number>();

const arr = Array.from({ length: 500 }, () => Math.floor(Math.random() * 1500));

for (const iterator of arr) {
  tree.insertion(new RBNode<number, number>(iterator, iterator));
}

tree.transversePreorder();
