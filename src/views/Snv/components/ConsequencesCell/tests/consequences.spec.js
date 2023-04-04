import { filterThanSortConsequencesByImpact, generateConsequencesDataLines } from '../consequences';

describe('filterThanSortConsequencesByImpact', () => {
  test('Should be robust', () => {
    expect(filterThanSortConsequencesByImpact(null)).toEqual([]);
  });
  test('Should ignore missing impact_score', () => {
    const consequences = [
      {
        node: {
          impact_score: null,
        },
      },
    ];

    const expected = [];

    expect(filterThanSortConsequencesByImpact(consequences)).toEqual(expected);
  });
  test('Should sort by impact_score DESC', () => {
    const consequences = [
      {
        node: {
          impact_score: 1,
        },
      },
      {
        node: {
          impact_score: 2,
        },
      },
    ];

    const expected = [
      {
        node: {
          impact_score: 2,
        },
      },
      {
        node: {
          impact_score: 1,
        },
      },
    ];

    expect(filterThanSortConsequencesByImpact(consequences)).toEqual(expected);
  });
  test('Should sort by canonical = true first if same impact_score', () => {
    const consequences = [
      {
        node: {
          impact_score: 1,
          canonical: false,
        },
      },
      {
        node: {
          impact_score: 1,
          canonical: true,
        },
      },
    ];

    const expected = [
      {
        node: {
          impact_score: 1,
          canonical: true,
        },
      },
      {
        node: {
          impact_score: 1,
          canonical: false,
        },
      },
    ];

    expect(filterThanSortConsequencesByImpact(consequences)).toEqual(expected);
  });
  test('Should sort by symbol if anything else is the same', () => {
    const consequences = [
      {
        node: {
          symbol: 'sym2',
          impact_score: 1,
          canonical: true,
        },
      },
      {
        node: {
          symbol: 'sym1',
          impact_score: 1,
          canonical: true,
        },
      },
    ];

    const expected = [
      {
        node: {
          symbol: 'sym1',
          impact_score: 1,
          canonical: true,
        },
      },
      {
        node: {
          symbol: 'sym2',
          impact_score: 1,
          canonical: true,
        },
      },
    ];

    expect(filterThanSortConsequencesByImpact(consequences)).toEqual(expected);
  });
  test('Should allowed missing symbol', () => {
    const consequences = [
      {
        node: {
          impact_score: 1,
          canonical: true,
        },
      },
      {
        node: {
          impact_score: 1,
          canonical: true,
        },
      },
    ];

    const expected = [
      {
        node: {
          impact_score: 1,
          canonical: true,
        },
      },
      {
        node: {
          impact_score: 1,
          canonical: true,
        },
      },
    ];

    expect(filterThanSortConsequencesByImpact(consequences)).toEqual(expected);
  });
});

describe('consequences: generateConsequencesDataLines', () => {
  test('Should be robust', () => {
    expect(generateConsequencesDataLines(null)).toEqual([]);
    expect(generateConsequencesDataLines([])).toEqual([]);
  });

  test('Should keep the better impact score', () => {
    const consequences = [
      {
        node: {
          symbol: 's1',
          impact_score: 1,
          consequences: ['c1'],
        },
      },
      {
        node: {
          symbol: 's1',
          impact_score: 2,
          consequences: ['c1'],
        },
      },
    ];

    const expected = [
      {
        node: {
          symbol: 's1',
          impact_score: 2,
          consequences: ['c1'],
        },
      },
    ];

    expect(generateConsequencesDataLines(consequences)).toEqual(expected);
  });

  test('Should return distinct (with higher score) consequences', () => {
    const consequences = [
      {
        node: {
          symbol: 's1',
          impact_score: 1,
          consequences: ['c1'],
        },
      },
      {
        node: {
          symbol: 's1',
          impact_score: 2,
          consequences: ['c1'],
        },
      },
    ];

    const expected = [
      {
        node: {
          symbol: 's1',
          impact_score: 2,
          consequences: ['c1'],
        },
      },
    ];

    expect(generateConsequencesDataLines(consequences)).toEqual(expected);
  });

  test('Should ignore empty consequences', () => {
    const consequences = [
      {
        node: {
          consequences: [],
        },
      },
    ];

    const expected = [];

    expect(generateConsequencesDataLines(consequences)).toEqual(expected);
  });

  test('Should group by symbol', () => {
    const consequences = [
      {
        node: {
          symbol: 's1',
          consequences: ['c1'],
        },
      },
      {
        node: {
          symbol: 's1',
          consequences: ['c3'],
        },
      },
      {
        node: {
          symbol: 's2',
          consequences: ['c2'],
        },
      },
      {
        node: {
          // no symbol
          consequences: ['c3'],
        },
      },
    ];

    const expected = [
      {
        node: {
          symbol: 's1',
          consequences: ['c1'],
        },
      },
      {
        node: {
          symbol: 's2',
          consequences: ['c2'],
        },
      },
      {
        node: {
          // no symbol
          consequences: ['c3'],
        },
      },
    ];

    expect(generateConsequencesDataLines(consequences)).toEqual(expected);
  });
});
