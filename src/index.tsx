import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import Loader from './components/Loader';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Suspense fallback={<Loader primary/>}>
      <App />
    </Suspense>
  </React.StrictMode>
);