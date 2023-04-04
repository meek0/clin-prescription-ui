import { TUserConfig } from 'api/user/models';

import { cleanupConfig } from '../thunks';

describe('cleanupConfig', () => {
  test('should remove robust', () => {
    expect(cleanupConfig({})).toEqual({});
  });
  test('should remove duplicates', () => {
    const config: TUserConfig = {
      data_exploration: {
        tables: {
          archives: {
            columns: [
              { key: 'key1', index: 0, visible: true },
              { key: 'key2', index: 0, visible: true },
              { key: 'key1', index: 0, visible: true },
              { key: 'key2', index: 1, visible: true },
              { key: 'key3', index: 0, visible: true },
              { key: 'key3', index: 0, visible: true },
              { key: 'key3', index: 2, visible: true },
            ],
          },
        },
      },
    };
    const expected: TUserConfig = {
      data_exploration: {
        tables: {
          archives: {
            columns: [
              { index: 0, key: 'key1', visible: true },
              { index: 1, key: 'key2', visible: true },
              { index: 2, key: 'key3', visible: true },
            ],
          },
        },
      },
    };
    expect(cleanupConfig(config)).toEqual(expected);
  });
});
