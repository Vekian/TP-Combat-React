import React from 'react';
import { createRoot } from 'react-dom/client';
import Game from './Components/Game';
import * as serviceWorker from './serviceWorker';
import { store } from "./store/store"
import { Provider } from "react-redux"
import 'bootstrap/dist/css/bootstrap.css';

const root = createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
        <Game />
    </Provider>
    );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
