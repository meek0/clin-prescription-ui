import { ReactNode } from 'react';
import { useHistory } from 'react-router';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Skeleton, Space, Typography } from 'antd';

import styles from './index.module.scss';

const { Title } = Typography;

export type ContentHeaderProps = {
  icon?: React.ReactNode;
  title: string;
  loading?: boolean;
  extra?: ReactNode[];
  actions?: ReactNode[];
  showBackArrow?: boolean;
};

const ContentHeader = ({
  icon,
  title,
  loading = false,
  extra,
  actions,
  showBackArrow = false,
}: ContentHeaderProps): React.ReactElement => {
  const history = useHistory();

  return (
    <div className={styles.contentHeader}>
      <Space className={styles.header} size={12}>
        {showBackArrow && (
          <ArrowLeftOutlined onClick={() => history.goBack()} className={styles.backArrow} />
        )}
        {icon && <span className={styles.headerIcon}>{icon}</span>}
        <Space size={12}>
          <Title level={3}>{title}</Title>
          <Skeleton
            title={{ width: 200 }}
            paragraph={false}
            loading={loading}
            className={styles.titleSkeleton}
            active
          >
            <Space>{extra}</Space>
          </Skeleton>
        </Space>
      </Space>
      <Space className={styles.actionsWrapper}>{actions}</Space>
    </div>
  );
};

export default ContentHeader;
