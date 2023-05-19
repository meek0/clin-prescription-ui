export enum GeneOverlapType {
  TYPE1 = 'type1',
  TYPE2 = 'type2',
  TYPE3 = 'type3',
}

/**
 * Type I:  cnvStart <= geneStart & cnvEnd >= geneEnd
 * Type II: cnvStart > geneStart & cnvEnd > geneEnd || cnvStart < geneStart & cnvEnd < geneEnd
 * Type III: cnvStart >= geneStart & cnvEnd <= geneEnd
 *
 * OR
 *
 * Type I:  overlap_gene_ratio = 1 & overlap_cnv_ratio =< 1
 * Type II: overlap_gene_ratio < 1 & overlap_cnv_ratio < 1
 * Type III: overlap_gene_ratio < 1 & overlap_cnv_ratio = 1
 */
export const getGeneOverlapType = (
  overlap_gene_ratio: number,
  overlap_cnv_ratio: number,
): GeneOverlapType => {
  if (overlap_gene_ratio == 1 && overlap_cnv_ratio <= 1) {
    return GeneOverlapType.TYPE1;
  }

  if (overlap_gene_ratio < 1 && overlap_cnv_ratio < 1) {
    return GeneOverlapType.TYPE2;
  }

  return GeneOverlapType.TYPE3;
};
