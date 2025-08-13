import { gql } from '@apollo/client';

import { analysisFields } from './models/Prescription';

export const PRESCRIPTIONS_QUERY = gql`
  query PrescriptionsInformation ($sqon: JSON, $first: Int, $offset: Int, $sort: [Sort], $searchAfter: JSON) {
    Analyses {
      hits(filters: $sqon, first: $first, offset: $offset, sort: $sort, searchAfter: $searchAfter) {
        edges {
          searchAfter
          node {
            id
            patient_id
            patient_mrn
            prescription_id
            ep
            created_on
            timestamp
            requester
            prenatal
            ldm
            analysis_code
            status
            priority
          }
        }
        total
      }
      aggregations (filters: $sqon){
        ${analysisFields.map(
          (f) =>
            f +
            ' {\n          buckets {\n            key\n            doc_count\n          }\n        }',
        )}
      }
    }
  }
`;

/* Person.id est mandatory pour le Back End */
export const PRESCRIPTIONS_SEARCH_QUERY = gql`
  query AnalysisSearch($sqon: JSON, $first: Int, $offset: Int, $sort: [Sort], $searchAfter: JSON) {
    Analyses {
      hits(filters: $sqon, first: $first, offset: $offset, sort: $sort, searchAfter: $searchAfter) {
        edges {
          searchAfter
          node {
            id
            patient_id
            patient_mrn
            prescription_id
            created_on
            ep
            timestamp
            requester
            ldm
            analysis_code
            status
            security_tags
            priority
            person {
              id
              first_name
              last_name
              ramq
            }
            project_code
          }
        }
        total
      }
    }
  }
`;
