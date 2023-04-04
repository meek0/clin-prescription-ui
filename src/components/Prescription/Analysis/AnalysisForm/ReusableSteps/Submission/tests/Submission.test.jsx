import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';

import Submission from '../index';

// stub to fix ANTD error
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

describe('Submission', () => {
  test('should be as the snapshot', () => {
    const initialState = {
      global: {
        lang: null,
        analysisCodeMapping: {},
      },
      user: { user: { practitionerRoles: [] } },
      prescription: { analysisData: { analysis: {} } },
    };
    const store = configureStore()(initialState);
    const component = renderer.create(
      <Provider store={store}>
        <Submission />
      </Provider>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
