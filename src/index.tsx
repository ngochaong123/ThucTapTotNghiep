import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

// link page
import Login from './Components/Login/Login';
import Register from './Components/Register/Register'; 
import Terms from "./Components/Terms/Terms";
import Page404 from "./Components/Page404/Page404";
import Menu from './Components/Menu/Menu'; 
// sach thu vien
import LibraryBook from "./Components/libraryBooks/libraryBook/libraryBooks";
import AddBook from "./Components/libraryBooks/AddBook/addBook";
import ChangeBook from "./Components/libraryBooks/ChangeBook/ChangeBook";
// thanh vien
import Member from "./Components/Member/Member/Member"; 
import AddMember from "./Components/Member/addMember/addMember";
import ChangeInfo from './Components/Member/changeInfor/changeInfor';
// mượn sách
import BorrowBooks from "./Components/borrowBooks/borrowBooks/borrowBooks";
import AddBorrowBooks from "./Components/borrowBooks/addBorrowBooks/addBorrowBooks";
import ChangeBorrowBooks from "./Components/borrowBooks/changeBorrowBooks/changeBorrowBooks";
//Tra sach
import ReturnBooks from "./Components/returnBooks/returnBooks";
// bao cao
import Report from "./Components/Report/Report/Report";
// nguoi dung
import Librarian from "./Components/librarian/librarian";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Root route redirects to Login */}
        <Route path="/" element={<Login />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Terms" element={<Terms />} />
        
        {/* Menu route with nested routes */}
        <Route path="/Menu" element={<Menu />}>
          {/* Index route: LibraryBook will be shown by default inside Menu */}
          <Route index element={<LibraryBook />} />
          
          {/* Nested routes under Menu */}
          {/* sach thu vien */}
          <Route path="LibraryBook" element={<LibraryBook />} />
          <Route path="AddBook" element={<AddBook />} />
          <Route path="changeBookInfor" element={<ChangeBook />} />
          
          {/* thanh vien */}
          <Route path="Member" element={<Member />} />
          <Route path="changeMemberInfor" element={<ChangeInfo />} />
          <Route path="AddMember" element={<AddMember />} />
          
          {/* Mượn sách */}
          <Route path="BorrowBooks" element={<BorrowBooks />} />
          <Route path="AddBorrowBooks" element={<AddBorrowBooks />} />
          <Route path="ChangeBorrowBooks" element={<ChangeBorrowBooks />} />

          {/* tra sách */}
          <Route path="ReturnBooks" element={<ReturnBooks />} />

          {/* bao cao */}
          <Route path="Report" element={<Report />} />
          
          {/* nguoi dung */}
          <Route path="Librarian" element={<Librarian />} />
        </Route>
        <Route path='*' element = {<Page404 />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// Optional: Measure performance in your app
reportWebVitals();
