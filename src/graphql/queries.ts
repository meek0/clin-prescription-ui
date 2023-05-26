import { gql } from '@apollo/client';

export const INDEX_EXTENDED_MAPPING = (index: string) => gql`
query ExtendedMapping${index} {
  ${index} {
    extended
  }
}
`;
