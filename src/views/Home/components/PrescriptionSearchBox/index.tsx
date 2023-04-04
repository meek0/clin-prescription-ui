import intl from 'react-intl-universal';
import { SearchOutlined } from '@ant-design/icons';

import PrescriptionAutoComplete from 'components/uiKit/search/PrescriptionAutoComplete';

import SearchBox from '../SearchBox';

const PrescriptionSearchBox = () => (
  <SearchBox
    icon={<SearchOutlined />}
    title={intl.get('home.prescription.search.box.title')}
    searchLabel={intl.get('home.prescription.search.box.label')}
    customAutoComplete={<PrescriptionAutoComplete />}
  />
);

export default PrescriptionSearchBox;
