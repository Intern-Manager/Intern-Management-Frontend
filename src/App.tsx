import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <AntdApp>
        <AppRoutes />
      </AntdApp>
    </Router>
  );
}

export default App;
