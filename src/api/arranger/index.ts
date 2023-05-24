import { sendRequestWithRpt } from 'api';
import { ARRANGER_API_PROJECT_URL } from 'providers/ApolloProvider';

const graphqlRequest = <T = any>(data: { query: any; variables: any }) =>
  sendRequestWithRpt<T>({
    method: 'POST',
    url: ARRANGER_API_PROJECT_URL,
    data,
  });

export const ArrangerApi = {
  graphqlRequest,
};
