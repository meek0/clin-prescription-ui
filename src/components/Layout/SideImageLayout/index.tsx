import { ReactElement } from 'react';
import { Row } from 'antd';
import cx from 'classnames';

import styles from './index.module.scss';

interface OwnProps {
  sideImgSrc?: string;
  theme?: 'light' | 'dark';
  children: ReactElement;
  className?: string;
}

const SideImageLayout = ({ sideImgSrc, theme = 'dark', children, className = ' ' }: OwnProps) => (
  <div className={cx(styles.sideImagePageContainer, className)}>
    <Row className={styles.contentWrapper}>
      <div
        className={styles.sideImageContainer}
        style={{
          backgroundImage: `url(${sideImgSrc})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      />
      <Row className={cx(styles.pageContent, theme === 'light' ? 'light' : 'dark')}>{children}</Row>
    </Row>
  </div>
);

export default SideImageLayout;
