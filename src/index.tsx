import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

// link page
import Login from './Components/Login/Login';
import Register from './Components/Register/Register'; 
import Menu from './Components/Menu/Menu'; 
// sach thu vien
import LibraryBook from "./Components/libraryBooks/libraryBook/libraryBooks";
// thanh vien
import Member from "./Components/Member/Member/Member"; 
import AddMember from "./Components/Member/addMember/addMember";
import ChangeInfo from './Components/Member/changeInfor/changeInfor';
// bao cao
import Report from "./Components/Report/Report";
// nguoi dung
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
          {/* Index route: LibraryBook will be shown by default */}
          <Route index element={<LibraryBook />} />
          {/* sach thu vien */}
          <Route path="LibraryBook" element={<LibraryBook />} />
          {/* thanh vien */}
          <Route path="Member" element={<Member />} />
          <Route path="changeInfo" element={<ChangeInfo />} />
          <Route path="AddMember" element={<AddMember />} />
          {/* bao cao */}
          <Route path="Report" element={<Report />} />
          {/* nguoi dung */}
          <Route path="User" element={<User />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);

// Optional: Measure performance in your app
reportWebVitals();
