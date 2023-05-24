export enum GenomicFeatureType {
  VARIANT = 'variant',
  GENE = 'gene',
}

export type Suggestion = {
  locus: string | undefined;
  type: GenomicFeatureType;
  matchedText: string;
  suggestion_id: string;
  symbol?: string;
  rsnumber?: string;
  ensembl_gene_id?: string;
  suggest: [{ input: string[]; weight: number }];
};

export interface ISuggestionPayload<T> {
  searchText: string;
  suggestions: T[];
}
