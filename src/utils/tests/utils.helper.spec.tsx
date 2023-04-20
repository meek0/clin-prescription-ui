import { appendBearerIfToken } from '../helper';

describe('Utils: Helper', () => {
  describe(`Function: ${appendBearerIfToken.name}`, () => {
    test('Should return token appended to Bearer', () => {
      expect(appendBearerIfToken('TestToken')).toEqual('Bearer TestToken');
    });

    test('Should return empty string if empty token', () => {
      expect(appendBearerIfToken('')).toEqual('');
    });

    test('Should return empty string if undefined token', () => {
      expect(appendBearerIfToken(undefined)).toEqual('');
    });

    test('Should return empty string if no token', () => {
      expect(appendBearerIfToken()).toEqual('');
    });
  });
});
