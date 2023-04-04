import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';

import IGV from '../index';

describe('IGV', () => {
  test('should be as the snapshot', () => {
    const initialState = {};
    const store = configureStore()(initialState);
    const component = renderer.create(
      <Provider store={store}>
        <IGV options={{}} />
      </Provider>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
