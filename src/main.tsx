import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import './index.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4f46e5',
          borderRadius: 8,
          fontFamily: 'Inter, sans-serif',
        },
      }}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </ConfigProvider>
  </StrictMode>,
);
