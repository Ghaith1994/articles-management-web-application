import {FormArticlePage} from './FormArticlePage'
import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import reducer from '../../reducers/index';
import { createStore } from 'redux'; 

test('renders correctly without crashing', () => {
    
    const store = createStore(reducer);

    const tree = renderer.create(
        <Provider store={store}>
            <FormArticlePage />
        </Provider>).toJSON();
    expect(tree).toMatchSnapshot();
});