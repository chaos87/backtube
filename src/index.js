import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';
import App from './App';
import { CALLBACK_PATH } from './config/urls';
import './index.scss';
import theme from './theme';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react'


ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Router>
                <LastLocationProvider>
                    <Route path="/" component={App} />
                    <Route path={CALLBACK_PATH} />
                </LastLocationProvider>
            </Router>
        </PersistGate>
    </Provider>
</ThemeProvider>,
  document.querySelector('#root'),
);
