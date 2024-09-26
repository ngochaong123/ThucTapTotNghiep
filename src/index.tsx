import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

// link page
import Login from './Components/Login/Login';
import Register from './Components/Register/Register'; 
import Menu from './Components/Menu/Menu'; 
import LibraryBook from "./Components/libraryBooks/libraryBooks";
import Member from "./Components/Member/Member"; // Fixed typo
import Report from "./Components/Report/Report";
import User from "./Components/User/User";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Main routes */}
        <Route path="/Login" element={<Login />} />  
        <Route path="/Register" element={<Register />} />  
        
        {/* Menu route with nested routes */}
        <Route path="/Menu" element={<Menu />}>
          <Route path="LibraryBook" element={<LibraryBook />} />
          <Route path="Member" element={<Member />} /> {/* Corrected the path */}
          <Route path="Report" element={<Report />} />
          <Route path="User" element={<User />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);

// Optional: Measure performance in your app
reportWebVitals();
