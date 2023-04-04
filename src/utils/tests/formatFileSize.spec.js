import { formatFileSize } from 'utils/formatFileSize';

describe('formatFileSize', () => {
  test('Should be robust', () => {
    expect(formatFileSize(1024)).toEqual('1.02 KB');
  });
});
