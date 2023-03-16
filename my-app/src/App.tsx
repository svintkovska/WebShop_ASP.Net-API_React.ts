import React, { ReactNode, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import HomePage from './comonents/home';
import { Routes, Route, Outlet, Link, useNavigate } from "react-router-dom";
import RegisterPage from './comonents/auth/register';
import LoginPage from './comonents/auth/login';
import ContinueRegistration from './comonents/auth/register/google';
import DefaultLayout from './comonents/containers';
import EditCategoryPage from './comonents/admin/categories/edit';
import CreateCategoryPage from './comonents/admin/categories/create';
import EditProfile from './comonents/auth/editProfile';
import ChangePassword from './comonents/auth/editProfile/chnagePassword';
import CategoriesList from './comonents/admin/categories/list';
import CategoriesPage from './comonents/shop/categories';
import ProductsList from './comonents/admin/products/list';
import EditProductPage from './comonents/admin/products/edit';
import CreateProductPage from './comonents/admin/products/create';
import ResetPassword from './comonents/auth/resetPassword';

function App() {


  return (

      <Routes>
        <Route path="/" element={<DefaultLayout/>}>
        <Route index element={<HomePage />} />
          <Route path="/categories/create" element={<CreateCategoryPage/>} />
          <Route path="/categories/list" element={<CategoriesList/>} />
          <Route path="/categories/edit/:categoryId" element={<EditCategoryPage></EditCategoryPage>} />
          <Route path="/products/list" element={<ProductsList/>} />
          <Route path="/products/create" element={<CreateProductPage/>} />
          <Route path="/products/edit/:productId" element={<EditProductPage></EditProductPage>} />
          <Route path="/account/register" element={<RegisterPage/>} />
          <Route path="/account/register/googleRegistration" element={<ContinueRegistration/>} />
          <Route path="/account/login" element={<LoginPage/>} />
          <Route path="/resetpassword" element={<ResetPassword/>} />

          <Route path="/account/editProfile" element={<EditProfile/>} />
          <Route path="/account/editProfile/changePassword" element={<ChangePassword/>} />
          <Route path="/categories" element={<CategoriesPage/>} />


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
