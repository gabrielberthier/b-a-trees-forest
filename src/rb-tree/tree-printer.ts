import { URBNode } from './rb-node';

export class TreePrinter<K, V> {
  private sb = '';

  constructor(private nil: URBNode<symbol, symbol>) {}

  traverseNodes(
    padding: string,
    pointer: string,
    node: URBNode<K, V>,
    hasRightSibling: boolean
  ): void {
    if (node !== this.nil) {
      this.sb += '\n';
      this.sb += padding;
      this.sb += pointer;
      this.sb += node.value.toString();

      let paddingBuilder = padding;
      if (hasRightSibling) {
        paddingBuilder += '│  ';
      } else {
        paddingBuilder += '   ';
      }

      const paddingForBoth = paddingBuilder.toString();
      const pointerRight = '└──';
      const pointerLeft = node.right !== this.nil ? '├──' : '└──';

      this.traverseNodes(
        paddingForBoth,
        pointerLeft,
        node.left,
        node.right !== this.nil
      );
      this.traverseNodes(paddingForBoth, pointerRight, node.right, false);
    }
  }

  traversePreOrder(root: URBNode<K, V>): string {
    if (root === this.nil) {
      return '';
    }

    this.sb = '';
    this.sb += root.value.toString();

    const pointerRight = '└──';
    const pointerLeft = root.right != null ? '├──' : '└──';

    this.traverseNodes('', pointerLeft, root.left, root.right !== this.nil);
    this.traverseNodes('', pointerRight, root.right, false);

    return this.sb;
  }
}
