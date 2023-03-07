import React, { ReactNode, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import HomePage from './comonents/home';
import CreatePage from './comonents/create';
import { Routes, Route, Outlet, Link, useNavigate } from "react-router-dom";
import EditPage from './comonents/Edit';
import RegisterPage from './comonents/auth/register';
import LoginPage from './comonents/auth/login';

function App() {

  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists in local storage
    const token = localStorage.getItem('token');
    if (token) {
      setAuthenticated(true);
    } else {
      navigate('/account/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Remove token from local storage
    localStorage.removeItem('token');
    // Update authenticated state
    setAuthenticated(false);
    // Navigate to login page
    navigate('/account/login');
  };

  return (
    <div>
      <Layout authenticated={authenticated} handleLogout={handleLogout}>
      <Routes>
          <Route index element={<Home />} />
          <Route path="categories/create" element={<Create/>} />
          <Route path="/categories/edit/:categoryId" element={<EditPage></EditPage>} />
          <Route path="/account/register" element={<Register/>} />
          <Route path="/account/login" element={<Login/>} />
          <Route path="*" element={<NoMatch />} />
      </Routes>
      </Layout>

    </div>
  );
}


function Layout({ authenticated,handleLogout,children
}: {authenticated: boolean;handleLogout: () => void;children: React.ReactNode;}) {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            My App
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/" className="nav-link active" aria-current="page">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="categories/create" className="nav-link">
                  Create
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {authenticated ? (
                <li className="nav-item">
                  <button onClick={handleLogout} className="nav-link btn btn-link">
                    Log Out
                  </button>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="account/register" className="nav-link">
                      Register
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="account/login" className="nav-link">
                      Log In
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
}


function Home() {
  return (
    <>
    <HomePage></HomePage>
    </>
  );
}

function Create() {
  return ( 
    <>
      <CreatePage></CreatePage>
    </>
  );
}
function Register() {
  return ( 
    <>
      <RegisterPage></RegisterPage>
    </>
  );
}
function Login() {
  return ( 
    <>
      <LoginPage></LoginPage>
    </>
  );
}
function NoMatch() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}


export default App;
