import intl from 'react-intl-universal';
import Empty from '@ferlab/ui/core/components/Empty';

const NoData = () => (
  <Empty showImage={false} noPadding align="left" description={intl.get('no.data.available')} />
);

export default NoData;
