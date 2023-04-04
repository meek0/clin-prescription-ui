import { gql } from '@apollo/client';

export const GET_VARIANT_COUNT = gql`
  query CnvCount($sqon: JSON) {
    cnv {
      hits(filters: $sqon) {
        total
      }
    }
  }
`;

export const VARIANT_QUERY = gql`
  query Cnv($sqon: JSON, $first: Int, $offset: Int, $sort: [Sort], $searchAfter: JSON) {
    cnv {
      hits(filters: $sqon, first: $first, offset: $offset, sort: $sort, searchAfter: $searchAfter) {
        total
        edges {
          searchAfter
          node {
            id
            hash
            aliquot_id
            patient_id
            chromosome
            sort_chromosome
            type
            qual
            start
            end
            name
            reflen
            cn
            number_genes
            filters
            calls
            sm
            bc
            pe
            father_id
            mother_id
            is_proband
            gender
            genes {
              hits {
                edges {
                  node {
                    gene_length
                    overlap_bases
                    overlap_cnv_ratio
                    overlap_exons
                    overlap_gene_ratio
                    symbol
                    panels
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
