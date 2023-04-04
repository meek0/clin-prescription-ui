import intl from 'react-intl-universal';
import { INDEXES } from 'graphql/constants';
import { GraphqlBackend } from 'providers';
import ApolloProvider from 'providers/ApolloProvider';

import useGetExtendedMappings from 'hooks/graphql/useGetExtendedMappings';

import VariantSearchLayout from '../components/VariantSearchLayout';

import { getMenuItems } from './facets';
import PageContent from './PageContent';

const SnvExplorationRqdm = () => {
  const variantMappingResults = useGetExtendedMappings(INDEXES.VARIANT);

  return (
    <VariantSearchLayout
      contentHeaderProps={{
        title: intl.get('screen.variantsearch.rqdm.title'),
      }}
      menuItems={getMenuItems(variantMappingResults)}
    >
      <PageContent variantMapping={variantMappingResults} />
    </VariantSearchLayout>
  );
};

const SnvExplorationRqdmWrapper = () => (
  <ApolloProvider backend={GraphqlBackend.ARRANGER}>
    <SnvExplorationRqdm />
  </ApolloProvider>
);

export default SnvExplorationRqdmWrapper;
