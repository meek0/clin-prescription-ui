import { generateAggregations } from '../queries';

describe('generateAggregations', () => {
  test('build aggregations', () => {
    expect(generateAggregations([{ type: 'id', field: 'foo' }])).toBeDefined;
  });
});
