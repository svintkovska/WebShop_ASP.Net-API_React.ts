import React, { ReactNode, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import HomePage from './comonents/home';
import { Routes, Route, Outlet, Link, useNavigate } from "react-router-dom";
import RegisterPage from './comonents/auth/register';
import LoginPage from './comonents/auth/login';
import ContinueRegistration from './comonents/auth/register/google';
import DefaultLayout from './comonents/containers';
import EditCategoryPage from './comonents/categories/edit';
import CreateCategoryPage from './comonents/categories/create';
import EditProfile from './comonents/auth/editProfile';

function App() {


  return (

      <Routes>
        <Route path="/" element={<DefaultLayout/>}>
        <Route index element={<HomePage />} />
          <Route path="categories/create" element={<CreateCategoryPage/>} />
          <Route path="/categories/edit/:categoryId" element={<EditCategoryPage></EditCategoryPage>} />
          <Route path="/account/register" element={<RegisterPage/>} />
          <Route path="/account/register/googleRegistration" element={<ContinueRegistration/>} />
          <Route path="/account/login" element={<LoginPage/>} />
          <Route path="/account/editProfile" element={<EditProfile/>} />
          {/* <Route path="*" element={<NoMatch />} /> */}
        </Route>         
      </Routes>
  );
}





// function NoMatch() {
//   return (
//     <div>
//       <h2>Not Found</h2>
//       <p>
//         <Link to="/">Go to the home page</Link>
//       </p>
//     </div>
//   );
// }


export default App;
