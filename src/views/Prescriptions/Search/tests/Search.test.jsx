import React from 'react';
import renderer from 'react-test-renderer';

import PatientSearchWrapper from '../index';

describe('PatientSearchWrapper', () => {
  test('should be as the snapshot', () => {
    const component = renderer.create(<PatientSearchWrapper />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
