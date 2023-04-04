import { GenomicFeatureType, Suggestion } from 'api/arranger/models';

export const filterByTypeAndWeight = (
  value: string,
  suggestions: Suggestion[],
  type: GenomicFeatureType,
  minWeight: number = 0,
): Suggestion[] =>
  suggestions?.filter(
    (s) =>
      s.type === type &&
      s.suggest?.length > 0 &&
      s.suggest.some(
        (i) =>
          i.input?.length > 0 &&
          i.weight >= minWeight &&
          i.input.some((j) => j.toLowerCase().includes(value.toLowerCase())),
      ),
  ) ?? [];
