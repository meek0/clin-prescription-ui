import React from 'react';
import Collapse, { CollapsePanel as FUICollapsePanel } from '@ferlab/ui/core/components/Collapse';
import { Spin } from 'antd';

import styles from './index.module.scss';

type Props = {
  header: React.ReactNode | string;
  children: React.ReactNode;
  bordered?: boolean;
  loading?: boolean;
};

const CollapsePanel = ({
  header,
  children,
  bordered = false,
  loading = false,
}: Props): React.ReactElement => (
  <div className={styles.collapsePanelWrapper}>
    <Spin spinning={loading}>
      <Collapse bordered={bordered} headerBorderOnly defaultActiveKey="1" arrowIcon="caretFilled">
        <FUICollapsePanel header={header} key={`1`}>
          {children}
        </FUICollapsePanel>
      </Collapse>
    </Spin>
  </div>
);

export default CollapsePanel;
