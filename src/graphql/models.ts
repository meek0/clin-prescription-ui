import { ISearchAfter } from '@ferlab/ui/core/graphql/types';

export interface ArrangerNodeData {
  id: string;
  cid?: string;
  key?: string;
}

export type AggregationBuckets = {
  buckets: [
    {
      key: string;
      doc_count: number;
    },
  ];
  stats: string;
};

export type Aggregations = Record<string, AggregationBuckets>;

export interface GqlResults<DataT> {
  data: DataT[];
  aggregations: Aggregations;
  loading: boolean;
  total: number;
  searchAfter?: ISearchAfter;
}

// Recursive type that can represent nested query
export interface ArrangerResultsTree<T extends ArrangerNodeData> {
  hits: ArrangerHits<T>;
}

interface ArrangerHits<T extends ArrangerNodeData> {
  total?: number;
  edges: ArrangerEdge<T>[];
}

type ArrangerEdge<T extends ArrangerNodeData> = {
  node: T;
};
