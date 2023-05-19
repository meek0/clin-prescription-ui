import { getSpecimen } from '../PatientTags';

describe('getSpecimen', () => {
  test('Should remove NA from sign', () => {
    const prescription = {
      subject: {
        resource: {
          requests: [
            {
              specimen: [
                {
                  resource: {
                    accessionIdentifier: {
                      value: 'bar',
                    },
                    parent: 'parent',
                  },
                },
              ],
            },
          ],
        },
      },
    };
    expect(getSpecimen('foo', prescription, null)).toEqual('bar');
  });
});
