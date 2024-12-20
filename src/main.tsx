import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider, Helmet } from 'react-helmet-async';

import './tailwind.css';
import styles from './index.css?inline';

import App from 'app';
import Providers from 'providers';

const helmetContext = {};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Providers>
      <HelmetProvider context={helmetContext}>
        <Helmet>
          <style>{styles}</style>
        </Helmet>

        <App />
      </HelmetProvider>
    </Providers>
  </React.StrictMode>
);
