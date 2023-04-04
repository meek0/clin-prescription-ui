import cx from 'classnames';

import styles from './index.module.scss';

const Container: React.FC<{ className?: string }> = (props) => (
  <div className={cx(styles.container, props.className)}>{props.children}</div>
);

export default Container;
