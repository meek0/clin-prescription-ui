import { VARIANT_QUERY, VARIANT_QUERY_NO_DONORS } from '../queries';

describe('Variants queries', () => {
  test('Should be defined', () => {
    expect(VARIANT_QUERY_NO_DONORS).toBeDefined();
    expect(VARIANT_QUERY).toBeDefined();
  });
});
