import React, { ReactNode, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/css/style.css';
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
import ProductsPage from './comonents/shop/products/productsPage';
import ProductItemPage from './comonents/shop/products/productItem';
import BasketPage from './comonents/shop/basket';
import UsersList from './comonents/admin/users/list';
import EditUserPage from './comonents/admin/users/edit';
import AdminLayout from './comonents/containers/admin';
import AdminHomePage from './comonents/home/admin';
import MakeOrderPage from './comonents/shop/order/makeOrder';
import UserOrders from './comonents/shop/order/userOrders';
import AdminOrders from './comonents/admin/orders';

function App() {


  return (

      <Routes>
        <Route path="/" element={<DefaultLayout/>}>
        <Route index element={<HomePage />} />
          <Route path="categories/create" element={<CreateCategoryPage/>} />
          <Route path="categories/list" element={<CategoriesList/>} />
          <Route path="categories/edit/:categoryId" element={<EditCategoryPage></EditCategoryPage>} />
          <Route path="products/list" element={<ProductsList/>} />
          <Route path="products/create" element={<CreateProductPage/>} />
          <Route path="products/edit/:productId" element={<EditProductPage></EditProductPage>} />
          <Route path="users/list" element={<UsersList/>} />
          <Route path="users/edit/:userId" element={<EditUserPage></EditUserPage>} />


          <Route path="account/register" element={<RegisterPage/>} />
          <Route path="account/register/googleRegistration" element={<ContinueRegistration/>} />
          <Route path="account/login" element={<LoginPage/>} />
          <Route path="resetpassword" element={<ResetPassword/>} />
          <Route path="account/editProfile" element={<EditProfile/>} />
          <Route path="account/editProfile/changePassword" element={<ChangePassword/>} />

          <Route path="shop/categories" element={<CategoriesPage/>} />
          <Route path="shop/products/:categoryId" element={<ProductsPage/>} />
          <Route path="shop/products/productItem/:productId" element={<ProductItemPage/>} />
          <Route path="shop/basket" element={<BasketPage/>} />
          <Route path="shop/makeOrder" element={<MakeOrderPage/>} />
          <Route path="shop/userOrders" element={<UserOrders/>} />

          {/* <Route path="*" element={<NoMatch />} /> */}
        </Route>    

        <Route path="/admin" element={<AdminLayout/>}>
        <Route index element={<AdminHomePage />} />
          <Route path="categories/create" element={<CreateCategoryPage/>} />
          <Route path="categories/list" element={<CategoriesList/>} />
          <Route path="categories/edit/:categoryId" element={<EditCategoryPage></EditCategoryPage>} />
          <Route path="products/list" element={<ProductsList/>} />
          <Route path="products/create" element={<CreateProductPage/>} />
          <Route path="products/edit/:productId" element={<EditProductPage></EditProductPage>} />
          <Route path="users/list" element={<UsersList/>} />
          <Route path="users/edit/:userId" element={<EditUserPage></EditUserPage>} />   
          <Route path="orders/list" element={<AdminOrders/>} />   
        </Route>   
      </Routes>
  );
}



export default App;
