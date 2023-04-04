import React from 'react';
import renderer from 'react-test-renderer';

import RequestTable from '../RequestTable';

describe('RequestTable', () => {
  test('should be as the snapshot', () => {
    const component = renderer.create(<RequestTable />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
