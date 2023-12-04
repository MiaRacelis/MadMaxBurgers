import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  RouterProvider,
  Navigate,
  createHashRouter
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import reportWebVitals from './reportWebVitals';
import './index.css';
import App from './App';
import {
  PageNotFound,
  Home,
  Login,
  Signup,
  Dashboard,
  Orders,
  Products,
  Customers,
  Profile,
  Cart,
  Checkout,
  OrderHistory,
} from './pages';

const routes = [
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/orders',
        element: <Orders />
      },
      {
        path: '/products',
        element: <Products />
      },
      {
        path: '/Customers',
        element: <Customers />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/cart',
        element: <Cart />
      },
      {
        path: '/checkout',
        element: <Checkout />
      },
      {
        path: '/order-history',
        element: <OrderHistory />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/sign-up',
    element: <Signup />
  },
  {
    path: '*',
    element: <PageNotFound />
  }
];

const router = createHashRouter(routes, { basename: '/'});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
