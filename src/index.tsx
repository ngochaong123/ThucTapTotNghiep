import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

// link page
import Login from './Components/Login/Login';
import Register from './Components/Register/Register'; 
import Menu from './Components/Menu/Menu'; 

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />  {/* Default route for login */}
        <Route path="/Register" element={<Register />} />  {/* Route for registration */}
        <Route path="/Menu" element={<Menu />} />  {/* Route for registration */}
      </Routes>
    </Router>
  </React.StrictMode>
);

// Optional: Measure performance in your app
reportWebVitals();
