import { downloadText } from 'utils/helper';

describe('downloadText', () => {
  test('Should be robust', () => {
    downloadText(null, 'file.tsv');
  });
});
