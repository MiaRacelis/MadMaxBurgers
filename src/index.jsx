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

import { STORAGE_ITEMS, itemExists, storeItems, } from './utils/storage-utils';

if (!itemExists(STORAGE_ITEMS.orders))
  storeItems(STORAGE_ITEMS.orders, require('./assets/orders.json'));

if (!itemExists(STORAGE_ITEMS.products))
  storeItems(STORAGE_ITEMS.products, require('./assets/products.json'));
if (!itemExists(STORAGE_ITEMS.users))
  storeItems(STORAGE_ITEMS.users, require('./assets/users.json'));

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
