import { useEffect, useState } from 'react';
import { Spin, Tree } from 'antd';
import { HpoApi } from 'api/hpo';
import { IHpoNode } from 'api/hpo/models';

import { isChecked } from './helper';
import { TreeNode } from './types';

interface OwnProps {
  checkedKeys?: string[];
  onCheckItem?: (key: string, check: boolean) => void;
  addTargetKey?: (key: string) => void;
  setTreeData?: (nodes: TreeNode[]) => void;
  height?: number;
  showSearch?: boolean;
  className?: string;
}

const ROOT_PHENOTYPE = 'Phenotypic abnormality (HP:0000118)';

const hpoDisplayName = (key: string, name: string) => `${name} (${key})`;

const hpoToTreeNode = (hpo: IHpoNode): TreeNode => ({
  title: hpoDisplayName(hpo.hpo_id, hpo.name),
  key: hpo.hpo_id,
  hasChildren: !hpo.is_leaf,
  isLeaf: hpo.is_leaf,
  children: [],
  disabled: false,
});

const fetchRootNodes = async (root: string) => {
  const { data, error } = await HpoApi.searchHpoChildren(root);

  if (error) {
    return [];
  }

  return data!.hits.map((item) => hpoToTreeNode(item._source)) ?? [];
};

const PhenotypeTree = ({
  checkedKeys = [],
  onCheckItem,
  addTargetKey = () => null,
  setTreeData,
  height = 600,
  className = '',
}: OwnProps) => {
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchRootNodes(ROOT_PHENOTYPE).then((nodes) => {
      setIsLoading(false);
      setTreeNodes(nodes);
    });
  }, []);

  useEffect(() => {
    setTreeData && setTreeData(treeNodes);
  }, [treeNodes, setTreeData]);

  const onLoadHpoChildren = (treeNodeClicked: any) =>
    new Promise<void>((resolve) => {
      const { title } = treeNodeClicked;

      setIsLoading(true);
      HpoApi.searchHpoChildren(title).then(({ data, error }) => {
        const node: TreeNode = treeNodeClicked.props.data;
        setIsLoading(false);

        if (!error) {
          node.children = data?.hits.map((item) => hpoToTreeNode(item._source));
          setTreeNodes([...treeNodes]);
          resolve();
        }
      });
    });

  return (
    <div className={className}>
      <Spin spinning={isLoading}>
        <Tree
          loadData={onLoadHpoChildren}
          checkStrictly
          checkable
          checkedKeys={checkedKeys}
          onCheck={(_, { node: { key } }) => {
            onCheckItem && onCheckItem(key.toString(), !isChecked(checkedKeys, key.toString()));
            addTargetKey && addTargetKey(key.toString());
          }}
          onSelect={(_, { node: { key } }) => {
            onCheckItem && onCheckItem(key.toString(), !isChecked(checkedKeys, key.toString()));
            addTargetKey && addTargetKey(key.toString());
          }}
          treeData={treeNodes}
          height={height}
        />
      </Spin>
    </div>
  );
};

export default PhenotypeTree;
