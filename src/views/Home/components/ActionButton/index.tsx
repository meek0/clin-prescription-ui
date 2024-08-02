import { PlusOutlined } from '@ant-design/icons';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Space, Typography } from 'antd';
import cx from 'classnames';

import styles from './index.module.css';

interface OwnProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}

const ActionButton = ({ icon, title, description, disabled = false, onClick }: OwnProps) => (
  <GridCard
    theme="shade"
    wrapperClassName={cx(styles.homeActionCardWrapper, disabled && styles.disabled)}
    className={styles.homeActionCard}
    contentClassName={styles.homeActionContent}
    onClick={disabled ? undefined : onClick}
    data-cy="ActionButton"
    bordered={!disabled}
    content={
      <Space className={styles.homeActionButton} size={0} direction="vertical">
        <span className={styles.homeActionIcon}>{icon}</span>
        <Space direction="vertical">
          <Typography.Title className={styles.text} level={3}>
            {title} <PlusOutlined className={styles.plusIcon} />
          </Typography.Title>
          <Typography.Text className={cx(styles.text, styles.description)}>
            {description}
          </Typography.Text>
        </Space>
      </Space>
    }
  />
);

export default ActionButton;
