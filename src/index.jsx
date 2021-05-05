import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { store } from './helpers';
import { App } from './app';

import 'bootstrap/dist/css/bootstrap.css';

import { configureDummyBackend } from './helpers';
configureDummyBackend();

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);