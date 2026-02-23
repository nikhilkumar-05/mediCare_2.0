import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { SocketProvider } from './context/SocketContext';

console.log('🔧 main.jsx: Before createRoot');

const root = createRoot(document.getElementById('root'));

console.log('🔧 main.jsx: After createRoot, before render');

root.render(
  <StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <App />
      </SocketProvider>
    </Provider>
  </StrictMode>
);

console.log('🔧 main.jsx: After render');
