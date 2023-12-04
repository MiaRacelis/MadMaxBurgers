import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createHashRouter,
  RouterProvider,
  Navigate
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import Sidebar from './components/Sidebar';
import {
  Home,
  Login,
  Dashboard,
  Orders,
  Products,
  Customers,
  Cart,
  Profile,
  Checkout,
  Signup,
  OrderHistory,
} from './pages';
import reportWebVitals from './reportWebVitals';
import { STORAGE_ITEMS, itemExists, getItem, storeItems } from './utils/storage-utils';

const pages = require('./assets/pages.json');

const isAuthenticated = getItem(STORAGE_ITEMS.isAuth) || false;
const user = getItem(STORAGE_ITEMS.user) || null;
const isLoggedIn = user !== null && isAuthenticated;
if (isLoggedIn) {
  if (!itemExists(STORAGE_ITEMS.orders))
    storeItems(STORAGE_ITEMS.orders, require('./assets/orders.json'));
}

if (!itemExists(STORAGE_ITEMS.products))
  storeItems(STORAGE_ITEMS.products, require('./assets/products.json'));
if (!itemExists(STORAGE_ITEMS.users))
  storeItems(STORAGE_ITEMS.users, require('./assets/users.json'));

const routerElements = {
  home: <Home />,
  login: <Login />,
  signup: <Signup />,
  dashboard: <Dashboard />,
  orders: <Orders />,
  products: <Products />,
  customers: <Customers />,
  cart: <Cart />,
  profile: <Profile />,
  checkout: <Checkout />,
  orderHistory: <OrderHistory />
};

const isPublic = page => {
  const allowedRoles = Array.from(page.allowed_roles);
  return !page.private || allowedRoles.length === 0;
};

const roleHasAccess = page => {
  const allowedRoles = Array.from(page.allowed_roles);
  return (user && allowedRoles.includes(user.role)) || allowedRoles.length === 0;
};

let routes = pages
  .filter(page => isLoggedIn === page.private || isPublic(page))
  .filter(roleHasAccess)
  .map(page => ({ path: page.path, element: routerElements[page.key]}));
routes = [...routes, { path: '*', element: <Navigate to="/" replace /> }];

const sidebarLinks = pages.filter(page => isLoggedIn
  && Array.from(page.allowed_roles).includes(user.role)
  && page.shown_in_nav);

const router = createHashRouter(routes);

const logout = () => {
  localStorage.removeItem(STORAGE_ITEMS.user);
  localStorage.removeItem(STORAGE_ITEMS.isAuth);
  window.location.pathname = '/login';
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    { isLoggedIn && <Sidebar
      brand={{ title: user ? `Welcome ${user.first_name}!` : '', logo: 'mdmx.png'  }}
      links={sidebarLinks}
      buttons={[{ text: 'Logout', handleClick: () => logout(), color: 'warning' }]} />}
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
