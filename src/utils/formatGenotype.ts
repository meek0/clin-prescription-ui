import { TABLE_EMPTY_PLACE_HOLDER } from './constants';

export const formatGenotype = (calls: number[]) =>
  calls ? calls.map((val) => (val === -1 ? '.' : val)).join('/') : TABLE_EMPTY_PLACE_HOLDER;
