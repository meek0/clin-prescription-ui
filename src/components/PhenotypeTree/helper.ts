import { isEmpty } from 'lodash';

import { TreeNode } from './types';

export const isChecked = (selectedKeys: string[], eventKey: string) =>
  selectedKeys.indexOf(eventKey) !== -1;

export const getFlattenTree = (nodes: TreeNode[]) => {
  const transferDataSource: TreeNode[] = [];

  if (isEmpty(nodes)) {
    return [];
  }
  const flatten = (list: TreeNode[] = []) => {
    list.forEach((item) => {
      transferDataSource.push(item);
      flatten(item.children);
    });
  };

  flatten(nodes);

  return transferDataSource;
};
