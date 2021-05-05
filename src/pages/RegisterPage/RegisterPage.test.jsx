import {RegisterPage} from './RegisterPage'
import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import reducer from '../../reducers/index';
import { createStore, applyMiddleware } from 'redux';
import { Router } from 'react-router-dom';
import { history } from '../../helpers';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

test('renders correctly without crashing', () => {
    const loggerMiddleware = createLogger();

    const store = createStore(reducer, applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    ));

    const tree = renderer.create(
        <Provider store={store}>
            <Router history={history}>
                <RegisterPage />
            </Router>
        </Provider>).toJSON();

    expect(tree).toMatchSnapshot();
});