import React from 'react';
import renderer from 'react-test-renderer';

import PrescriptionAutoComplete from '../index';

describe('PrescriptionAutoComplete', () => {
  test('should be as the snapshot', () => {
    const component = renderer.create(<PrescriptionAutoComplete />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
