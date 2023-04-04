import ScrollContent from '@ferlab/ui/core/layout/ScrollContent';
import cx from 'classnames';

import ConditionalWrapper from 'components/utils/ConditionalWrapper';

import Container from '../Container';
import Footer from '../Footer';

import styles from './index.module.scss';

interface OwnProps {
  scrollId?: string;
  children: React.ReactElement;
  className?: string;
  container?: boolean;
}

const ScrollContentWithFooter = ({
  children,
  scrollId,
  className = '',
  container = false,
}: OwnProps) => (
  <ScrollContent id={scrollId} className={cx(styles.contentWithFooter, className)}>
    <div className={styles.mainWrapper}>
      <ConditionalWrapper
        condition={container}
        wrapper={(children) => (
          <div className={styles.containerWrapper}>
            <Container className={styles.container}>{children}</Container>
          </div>
        )}
      >
        {children}
      </ConditionalWrapper>
      <Footer />
    </div>
  </ScrollContent>
);

export default ScrollContentWithFooter;
